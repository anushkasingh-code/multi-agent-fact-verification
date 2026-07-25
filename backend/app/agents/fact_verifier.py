"""
Fact Verification Agent module.
Evaluates atomic claims against retrieved web evidence context using structured LLM output.
"""

import logging
from typing import List, Optional
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.prompts.verifier_prompts import FACT_VERIFIER_SYSTEM_PROMPT
from app.graph.state import Claim, Source
from app.services.llm_factory import llm_factory

logger = logging.getLogger(__name__)


class VerificationVerdict(BaseModel):
    """Structured Pydantic schema for fact verification verdict."""
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
        description="Detailed explanation justifying the verdict based on evidence",
    )
    supporting_source_ids: List[str] = Field(
        default_factory=list,
        description="List of source IDs that corroborate the claim",
    )
    contradicting_source_ids: List[str] = Field(
        default_factory=list,
        description="List of source IDs that refute or contradict the claim",
    )


async def verify_claim(
    claim: Claim,
    sources: List[Source],
    provider: Optional[str] = None,
) -> Claim:
    """
    Cross-checks a single claim statement against source snippets using structured LLM inference.

    Args:
        claim: Claim object to verify.
        sources: List of retrieved Source objects.
        provider: Optional LLM provider override ('claude' or 'openai').

    Returns:
        Claim: Updated Claim domain object with verdict, confidence, reasoning, and source pointers.
    """
    if not claim or not isinstance(claim, Claim):
        raise ValueError("Valid Claim object must be provided.")

    logger.info(f"Verifying claim '{claim.id}': '{claim.text[:50]}...'")

    context_lines: List[str] = []
    for src in sources:
        context_lines.append(f"[{src.id}] ({src.title} - {src.url}):\n{src.snippet}\n")
    context_text = "\n".join(context_lines) if context_lines else "No web source evidence retrieved."

    try:
        provider_clean = (provider or "").lower()
        if provider_clean == "openai":
            base_llm = llm_factory.get_openai(temperature=0.0)
        elif provider_clean == "claude":
            base_llm = llm_factory.get_anthropic(temperature=0.0)
        else:
            base_llm = llm_factory.get_default_llm(temperature=0.0)

        structured_llm = base_llm.with_structured_output(VerificationVerdict)

        prompt = (
            f"Target Claim to Verify:\n"
            f"ID: {claim.id}\n"
            f"Statement: {claim.text}\n"
            f"Category: {claim.category}\n\n"
            f"Retrieved Evidence Context:\n"
            f"{context_text}\n\n"
            f"Evaluate the claim and output the structured verification verdict."
        )

        messages = [
            SystemMessage(content=FACT_VERIFIER_SYSTEM_PROMPT),
            HumanMessage(content=prompt),
        ]

        verdict_result: VerificationVerdict = await structured_llm.ainvoke(messages)

        claim.verdict = verdict_result.verdict.upper()
        claim.confidence = round(verdict_result.confidence, 2)
        claim.reasoning = verdict_result.reasoning
        claim.supporting_sources = verdict_result.supporting_source_ids
        claim.contradicting_sources = verdict_result.contradicting_source_ids

        logger.info(
            f"Claim '{claim.id}' verified as {claim.verdict} "
            f"(confidence={claim.confidence})"
        )
        return claim

    except Exception as e:
        logger.error(f"Failed verification for claim '{claim.id}': {e}", exc_info=True)
        claim.verdict = "INCONCLUSIVE"
        claim.confidence = 0.0
        claim.reasoning = f"Verification failed due to error: {str(e)}"
        return claim
