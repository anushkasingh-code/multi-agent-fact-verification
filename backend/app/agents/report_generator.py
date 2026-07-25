"""
Report Generator Agent module.
Synthesizes verified claims, sources, and detected contradictions into a comprehensive Markdown research paper.
"""

import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.prompts.report_prompts import REPORT_GENERATOR_SYSTEM_PROMPT
from app.graph.state import Claim, Source, Contradiction
from app.services.llm_factory import llm_factory

logger = logging.getLogger(__name__)


class StructuredReportOutput(BaseModel):
    """Structured Pydantic schema for report generator output."""
    report_markdown: str = Field(
        ...,
        description="Comprehensive, publication-ready Markdown research report with inline citations and Fact Audit Table",
    )
    summary_takeaway: str = Field(
        ...,
        description="Concise 2-sentence executive summary takeaway",
    )


async def generate_report(
    user_query: str,
    claims: List[Claim],
    sources: List[Source],
    contradictions: List[Contradiction],
    provider: Optional[str] = None,
) -> str:
    """
    Synthesizes research context into a structured Markdown research paper using structured LLM invocation.

    Args:
        user_query: Original user research query string.
        claims: Verified list of Claim objects.
        sources: List of retrieved Source objects.
        contradictions: List of detected Contradiction objects.
        provider: Optional LLM provider override ('claude', 'openai', or 'gemini').

    Returns:
        str: Generated Markdown report string.
    """
    if not user_query or not isinstance(user_query, str):
        raise ValueError("Valid user_query string must be provided.")

    logger.info(f"Generating markdown report for query: '{user_query[:50]}...'")

    claims_summary = "\n".join([
        f"- [{c.id}] '{c.text}' | Category: {c.category} | Verdict: {c.verdict or 'UNVERIFIED'} "
        f"(Confidence: {c.confidence or 0.0}) | Reasoning: {c.reasoning or 'N/A'}"
        for c in claims
    ])

    sources_summary = "\n".join([
        f"- [{s.id}] {s.title} ({s.domain or 'web'}): {s.url}\n  Snippet: {s.snippet[:200]}..."
        for s in sources
    ])

    contradictions_summary = "\n".join([
        f"- Conflict between [{ctr.source_a_id}] and [{ctr.source_b_id}] regarding claim [{ctr.claim_id}]: {ctr.conflict_description}"
        for ctr in contradictions
    ]) if contradictions else "No major source contradictions detected."

    prompt = (
        f"Research Topic Query:\n{user_query}\n\n"
        f"Verified Claims Breakdown:\n{claims_summary or 'None'}\n\n"
        f"Web Evidence Sources:\n{sources_summary or 'None'}\n\n"
        f"Source Contradictions:\n{contradictions_summary}\n\n"
        f"Synthesize all findings into a complete, professional Markdown research report."
    )

    try:
        provider_clean = (provider or "").lower()
        if provider_clean == "openai":
            base_llm = llm_factory.get_openai(temperature=0.2)
        elif provider_clean == "claude":
            base_llm = llm_factory.get_anthropic(temperature=0.2)
        elif provider_clean == "gemini":
            base_llm = llm_factory.get_gemini(temperature=0.2)
        else:
            base_llm = llm_factory.get_default_llm(temperature=0.2)

        structured_llm = base_llm.with_structured_output(StructuredReportOutput)

        messages = [
            SystemMessage(content=REPORT_GENERATOR_SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]

        result: StructuredReportOutput = await structured_llm.ainvoke(messages)
        logger.info("Successfully generated markdown report.")
        return result.report_markdown

    except Exception as e:
        logger.error(f"Failed to generate report: {e}", exc_info=True)
        fallback_markdown = (
            f"# Fact Verification Report: {user_query}\n\n"
            f"## Status\nReport generation encountered an error: {str(e)}\n\n"
            f"## Extracted Claims\n{claims_summary}\n\n"
            f"## Sources Consulted\n{sources_summary}"
        )
        return fallback_markdown
