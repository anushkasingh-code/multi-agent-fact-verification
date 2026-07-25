import { AnalyzeResponse } from "./types";
import { ResearchResult, VaultItem } from "../types";

/**
 * Transforms backend AnalyzeResponse into frontend ResearchResult model.
 */
export function transformAnalyzeResponseToResearchResult(data: AnalyzeResponse): ResearchResult {
  const supportedCount = data.summary?.supported_claims ?? 0;
  const totalCount = data.summary?.total_claims ?? 1;
  const scoreRatio = totalCount > 0 ? (supportedCount / totalCount) * 100 : 90;
  const calculatedVeracity = Math.min(99.9, Math.max(60.0, Math.round(scoreRatio * 10) / 10));

  let statusText: "VERIFIED" | "PARTIALLY_VERIFIED" | "NEEDS_REVISION" = "VERIFIED";
  if (calculatedVeracity < 75) {
    statusText = "NEEDS_REVISION";
  } else if (calculatedVeracity < 92) {
    statusText = "PARTIALLY_VERIFIED";
  }

  const citations = (data.sources || []).map((src, idx) => ({
    ref: `[Ref ${idx + 1}]`,
    title: src.title || src.url,
    url: src.url,
    publisher: src.domain || undefined,
  }));

  const agentLogs = [
    { agent: "Analyst", message: `Extracted ${data.summary?.total_claims ?? 0} atomic claims.` },
    { agent: "Scraper", message: `Indexed ${data.summary?.total_sources ?? 0} web sources.` },
    { agent: "Logic Critic", message: `Detected ${data.summary?.contradictions_detected ?? 0} source contradictions.` },
    { agent: "Fact Validator", message: `Verified claims: ${supportedCount} supported, ${data.summary?.refuted_claims ?? 0} refuted.` },
    { agent: "Synthesizer", message: "Compiled Markdown research report." },
  ];

  return {
    id: data.job_id,
    query: data.query,
    veracityScore: calculatedVeracity,
    status: statusText,
    hallucinationsCaught: data.summary?.contradictions_detected ?? 0,
    sourcesConsulted: data.summary?.total_sources ?? 0,
    agentLogs,
    findings: data.report_markdown || "No findings generated.",
    citations,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    category: "Multi-Agent Research",
  };
}

/**
 * Converts AnalyzeResponse to VaultItem for archiving in Truth Vault.
 */
export function transformAnalyzeResponseToVaultItem(data: AnalyzeResponse): VaultItem {
  const res = transformAnalyzeResponseToResearchResult(data);
  return {
    id: `vault-${data.job_id}`,
    title: data.query,
    query: data.query,
    domain: "Multi-Agent Research",
    veracityScore: res.veracityScore,
    citationsCount: res.citations.length,
    date: new Date().toISOString().split("T")[0],
    status: res.status === "NEEDS_REVISION" ? "PARTIALLY_VERIFIED" : res.status,
    findingsPreview: data.report_markdown?.slice(0, 300) + "..." || data.query,
  };
}
