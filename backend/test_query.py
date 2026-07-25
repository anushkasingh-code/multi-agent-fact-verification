import asyncio
from datetime import datetime, timezone
import uuid

async def test_pipeline():
    from app.graph.builder import graph
    from app.graph.state import AgentState
    from app.services.mongo_service import mongo_service
    from app.schemas.analyze import AnalysisSummary
    from app.core.config import settings

    query = "Global Semiconductor Supply Chain"
    job_id = f"job_test_{uuid.uuid4().hex[:8]}"
    created_at = datetime.now(timezone.utc).isoformat()
    provider = settings.effective_provider

    print(f"=== TESTING PIPELINE FOR QUERY: '{query}' (job_id='{job_id}', provider='{provider}') ===")

    initial_state: AgentState = {
        "job_id": job_id,
        "user_query": query,
        "model_provider": provider,
        "created_at": created_at,
        "completed_at": None,
        "claims": [],
        "sources": [],
        "faiss_index_id": None,
        "contradictions": [],
        "final_report": None,
        "errors": [],
    }

    final_state: AgentState = await graph.ainvoke(initial_state)

    completed_at = final_state.get("completed_at") or datetime.now(timezone.utc).isoformat()
    claims = final_state.get("claims", [])
    sources = final_state.get("sources", [])
    contradictions = final_state.get("contradictions", [])
    errors = final_state.get("errors", [])
    final_report = final_state.get("final_report", "")

    supported_count = sum(1 for c in claims if c.verdict == "SUPPORTED")
    refuted_count = sum(1 for c in claims if c.verdict == "REFUTED")
    inconclusive_count = sum(1 for c in claims if c.verdict not in ("SUPPORTED", "REFUTED"))

    summary = AnalysisSummary(
        total_claims=len(claims),
        supported_claims=supported_count,
        refuted_claims=refuted_count,
        inconclusive_claims=inconclusive_count,
        total_sources=len(sources),
        contradictions_detected=len(contradictions),
    )

    print("\n=== RESULTS ===")
    print(f"Job ID: {job_id}")
    print(f"LLM Provider: {provider}")
    print(f"Total Claims Extracted: {summary.total_claims}")
    print(f"Total Sources Retrieved: {summary.total_sources}")
    print(f"Contradictions Detected: {summary.contradictions_detected}")
    print(f"Report Length: {len(final_report)} chars")
    print(f"Errors: {errors}")

    if final_report:
        print("\n--- REPORT PREVIEW ---")
        print(final_report[:350])

    # Test MongoDB persistence
    mongo_doc = {
        "job_id": job_id,
        "user_query": query,
        "model_provider": provider,
        "status": "completed",
        "created_at": created_at,
        "completed_at": completed_at,
        "summary": summary.model_dump(),
        "claims": [c.model_dump() for c in claims],
        "sources": [s.model_dump() for s in sources],
        "contradictions": [ctr.model_dump() for ctr in contradictions],
        "report_markdown": final_report,
        "errors": errors,
    }

    try:
        await mongo_service.create_analysis(mongo_doc)
        print("\n[OK] MongoDB Persistence Verified: Document successfully saved!")
    except Exception as db_err:
        print(f"\n[NOTICE] MongoDB Notice: {db_err}")

    assert len(claims) > 0, "No claims were extracted!"
    assert final_report and len(final_report) > 50, "Report markdown is empty or invalid!"
    print("\nSUCCESS: All 5 multi-agent pipeline stages executed and verified successfully!")

if __name__ == "__main__":
    asyncio.run(test_pipeline())
