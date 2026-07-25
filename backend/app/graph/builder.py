"""
LangGraph StateGraph builder and workflow assembly module.
Wires the 5 agents (Claim Extractor, Search Retriever, Fact Verifier, Contradiction Detector, Report Generator) into an executable state graph.
"""

from datetime import datetime, timezone
import logging
from typing import Any, Dict, List
from langgraph.graph import StateGraph, START, END

from app.graph.state import AgentState, Claim
from app.agents.claim_extractor import extract_claims
from app.agents.search_retriever import retrieve_and_index_evidence
from app.agents.fact_verifier import verify_claim
from app.agents.contradiction_detector import detect_contradictions
from app.agents.report_generator import generate_report

logger = logging.getLogger(__name__)


async def claim_extractor_node(state: AgentState) -> Dict[str, Any]:
    """
    Claim Extractor Node: Decomposes user_query into atomic Claims.
    """
    job_id = state.get("job_id", "")
    query = state.get("user_query", "")
    logger.info(f"[Node: claim_extractor] Processing job_id='{job_id}'")

    try:
        claims = await extract_claims(query=query)
        return {"claims": claims}
    except Exception as e:
        logger.error(f"[Node: claim_extractor] Failed for job_id='{job_id}': {e}", exc_info=True)
        errors = state.get("errors", []) + [f"Claim extraction failed: {str(e)}"]
        return {"claims": [], "errors": errors}


async def search_retriever_node(state: AgentState) -> Dict[str, Any]:
    """
    Search & Retrieval Node: Searches Tavily, generates embeddings, loads FAISS index.
    """
    job_id = state.get("job_id", "")
    claims = state.get("claims", [])
    logger.info(f"[Node: search_retriever] Processing job_id='{job_id}' for {len(claims)} claims")

    try:
        sources, faiss_index_id = await retrieve_and_index_evidence(job_id=job_id, claims=claims)
        return {"sources": sources, "faiss_index_id": faiss_index_id}
    except Exception as e:
        logger.error(f"[Node: search_retriever] Failed for job_id='{job_id}': {e}", exc_info=True)
        errors = state.get("errors", []) + [f"Evidence retrieval failed: {str(e)}"]
        return {"sources": [], "faiss_index_id": job_id, "errors": errors}


async def fact_verifier_node(state: AgentState) -> Dict[str, Any]:
    """
    Fact Verification Node: Cross-checks claims against retrieved sources.
    """
    job_id = state.get("job_id", "")
    claims = state.get("claims", [])
    sources = state.get("sources", [])
    logger.info(f"[Node: fact_verifier] Processing job_id='{job_id}'")

    verified_claims: List[Claim] = []
    errors = list(state.get("errors", []))

    for claim in claims:
        try:
            verified_claim = await verify_claim(claim=claim, sources=sources)
            verified_claims.append(verified_claim)
        except Exception as e:
            logger.error(f"[Node: fact_verifier] Error verifying claim '{claim.id}': {e}", exc_info=True)
            claim.verdict = "INCONCLUSIVE"
            claim.reasoning = f"Verification failed: {str(e)}"
            verified_claims.append(claim)
            errors.append(f"Verification error for claim {claim.id}: {str(e)}")

    return {"claims": verified_claims, "errors": errors}


async def contradiction_detector_node(state: AgentState) -> Dict[str, Any]:
    """
    Contradiction Detector Node: Cross-examines sources for discrepancies.
    """
    job_id = state.get("job_id", "")
    claims = state.get("claims", [])
    sources = state.get("sources", [])
    logger.info(f"[Node: contradiction_detector] Processing job_id='{job_id}'")

    try:
        contradictions = await detect_contradictions(claims=claims, sources=sources)
        return {"contradictions": contradictions}
    except Exception as e:
        logger.error(f"[Node: contradiction_detector] Failed for job_id='{job_id}': {e}", exc_info=True)
        errors = state.get("errors", []) + [f"Contradiction detection failed: {str(e)}"]
        return {"contradictions": [], "errors": errors}


async def report_generator_node(state: AgentState) -> Dict[str, Any]:
    """
    Report Generator Node: Synthesizes final Markdown report.
    """
    job_id = state.get("job_id", "")
    query = state.get("user_query", "")
    claims = state.get("claims", [])
    sources = state.get("sources", [])
    contradictions = state.get("contradictions", [])
    logger.info(f"[Node: report_generator] Synthesizing report for job_id='{job_id}'")

    try:
        report_markdown = await generate_report(
            user_query=query,
            claims=claims,
            sources=sources,
            contradictions=contradictions,
        )
        completed_at = datetime.now(timezone.utc).isoformat()
        return {"final_report": report_markdown, "completed_at": completed_at}
    except Exception as e:
        logger.error(f"[Node: report_generator] Failed for job_id='{job_id}': {e}", exc_info=True)
        completed_at = datetime.now(timezone.utc).isoformat()
        errors = state.get("errors", []) + [f"Report generation failed: {str(e)}"]
        return {"final_report": f"# Research Report: {query}\n\nReport generation failed: {str(e)}", "completed_at": completed_at, "errors": errors}


def build_graph() -> StateGraph:
    """
    Constructs and wires the multi-agent StateGraph pipeline.

    Execution Flow:
    START -> claim_extractor -> search_retriever -> fact_verifier -> contradiction_detector -> report_generator -> END
    """
    builder = StateGraph(AgentState)

    # Register nodes
    builder.add_node("claim_extractor", claim_extractor_node)
    builder.add_node("search_retriever", search_retriever_node)
    builder.add_node("fact_verifier", fact_verifier_node)
    builder.add_node("contradiction_detector", contradiction_detector_node)
    builder.add_node("report_generator", report_generator_node)

    # Wire sequential edges
    builder.add_edge(START, "claim_extractor")
    builder.add_edge("claim_extractor", "search_retriever")
    builder.add_edge("search_retriever", "fact_verifier")
    builder.add_edge("fact_verifier", "contradiction_detector")
    builder.add_edge("contradiction_detector", "report_generator")
    builder.add_edge("report_generator", END)

    return builder


# Compile reusable executable graph instance
workflow = build_graph()
graph = workflow.compile()


def get_graph():
    """
    Returns the compiled LangGraph execution graph instance.
    """
    return graph
