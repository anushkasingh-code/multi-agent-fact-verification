"""
Fact Verification Agent module.
Evaluates atomic claims against retrieved web evidence context using batch structured LLM output.
"""

import logging
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.prompts.verifier_prompts import FACT_VERIFIER_SYSTEM_PROMPT
from app.graph.state import Claim, Source
from app.services.faiss_service import faiss_service
from app.llm.llm_factory import get_llm

logger = logging.getLogger(__name__)


class VerificationVerdictItem(BaseModel):
    """Structured Pydantic schema for single claim verification verdict in batch."""
    claim_id: str = Field(..., description="ID of the claim (e.g. 'claim_01')")
    verdict: str = Field(
        ...,
        description="Verification verdict: 'SUPPORTED', 'REFUTED', or 'INCONCLUSIVE'",
    )
    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0,
        description="Confidence score between 0.0 and 1.0",
    )
    reasoning: str = Field(
        ...,
        description="Concise explanation justifying the verdict based on evidence (max 200 chars)",
    )
    supporting_source_ids: List[str] = Field(
        default_factory=list,
        description="List of source IDs that corroborate the claim",
    )
    contradicting_source_ids: List[str] = Field(
        default_factory=list,
        description="List of source IDs that refute or contradict the claim",
    )


class BatchVerificationVerdicts(BaseModel):
    """Container schema for batch verification verdicts for all input claims."""
    verdicts: List[VerificationVerdictItem] = Field(
        ...,
        description="List of verification verdicts matching every input claim ID",
    )


async def verify_claim(
    claim: Claim,
    sources: List[Source],
    provider: Optional[str] = None,
) -> Claim:
    """Legacy single claim wrapper delegating to verify_claims_batch."""
    results = await verify_claims_batch(claims=[claim], sources=sources, job_id="", provider=provider)
    return results[0] if results else claim


async def verify_claims_batch(
    claims: List[Claim],
    sources: List[Source],
    job_id: str = "",
    provider: Optional[str] = None,
) -> List[Claim]:
    """
    Evaluates all claims in a single BATCH LLM call using top-3 FAISS similarity chunks
    and compressed evidence summaries.

    Args:
        claims: List of Claim domain objects to verify.
        sources: List of retrieved Source domain objects.
        job_id: Optional FAISS vector index identifier for similarity search.
        provider: Optional LLM provider override.

    Returns:
        List[Claim]: Updated Claim domain objects with verdicts, confidence, and reasoning.
    """
    if not claims:
        return []

    logger.info(f"Executing BATCH fact verification for {len(claims)} claims across {len(sources)} sources...")

    # Build compressed evidence blocks using FAISS similarity chunks (top 3 per claim)
    compressed_evidence_lines: List[str] = []
    seen_source_ids = set()

    for claim in claims:
        top_chunks: List[Dict[str, Any]] = []
        if job_id and faiss_service.has_index(job_id):
            try:
                top_chunks = faiss_service.search_similar(index_id=job_id, query=claim.text, k=3)
            except Exception as e:
                logger.warning(f"FAISS search failed for claim '{claim.id}': {e}")

        if top_chunks:
            for chunk in top_chunks:
                src_id = chunk.get("source_id", "src_unknown")
                if src_id not in seen_source_ids:
                    seen_source_ids.add(src_id)
                    title = chunk.get("title", "")
                    url = chunk.get("url", "")
                    snippet = chunk.get("snippet", "")[:400].strip()
                    score = round(float(chunk.get("score", 0.0)), 2)
                    compressed_evidence_lines.append(
                        f"[{src_id}] Title: {title} | Score: {score} | URL: {url}\nSummary: {snippet}"
                    )
        else:
            for src in sources[:4]:
                if src.id not in seen_source_ids:
                    seen_source_ids.add(src.id)
                    snippet = src.snippet[:400].strip()
                    score = round(float(src.score or 0.0), 2)
                    compressed_evidence_lines.append(
                        f"[{src.id}] Title: {src.title} | Score: {score} | URL: {src.url}\nSummary: {snippet}"
                    )

    evidence_text = "\n\n".join(compressed_evidence_lines) if compressed_evidence_lines else "No web source evidence retrieved."

    claims_text_lines = [
        f"Claim ID: {c.id}\nStatement: {c.text}\nCategory: {c.category}\n"
        for c in claims
    ]
    claims_prompt_block = "\n".join(claims_text_lines)

    try:
        provider_clean = (provider or "").lower()
        base_llm = get_llm(provider=provider_clean, temperature=0.0)
        structured_llm = base_llm.with_structured_output(BatchVerificationVerdicts)

        prompt = (
            f"TARGET CLAIMS TO VERIFY:\n"
            f"{claims_prompt_block}\n\n"
            f"COMPRESSED EVIDENCE CONTEXT:\n"
            f"{evidence_text}\n\n"
            f"Cross-examine evidence against each claim and return structured JSON verdicts for ALL input claim IDs."
        )

        messages = [
            SystemMessage(content=FACT_VERIFIER_SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]

        batch_results: BatchVerificationVerdicts = await structured_llm.ainvoke(messages)
        verdicts_map = {item.claim_id: item for item in batch_results.verdicts}

        for claim in claims:
            if claim.id in verdicts_map:
                v = verdicts_map[claim.id]
                claim.verdict = v.verdict.upper()
                claim.confidence = round(v.confidence, 2)
                claim.reasoning = v.reasoning
                claim.supporting_sources = v.supporting_source_ids
                claim.contradicting_sources = v.contradicting_source_ids
            else:
                claim.verdict = "INCONCLUSIVE"
                claim.confidence = 0.0
                claim.reasoning = "Verdict missing from batch evaluation."

        logger.info(f"Successfully batch-verified {len(claims)} claims.")
        return claims

    except Exception as e:
        logger.error(f"Failed batch verification: {e}", exc_info=True)
        for claim in claims:
            claim.verdict = "INCONCLUSIVE"
            claim.confidence = 0.0
            claim.reasoning = f"Batch verification failed: {str(e)}"
        return claims
