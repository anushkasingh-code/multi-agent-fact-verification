import { BackendClaim, BackendContradiction, BackendSource } from "./types";
import { CollaborationMessage } from "../types";

/**
 * Transforms backend execution state into real-time Agent Collaboration messages.
 */
export function transformStateToCollaborationMessages(
  query: string,
  claims: BackendClaim[],
  sources: BackendSource[],
  contradictions: BackendContradiction[],
  jobId: string
): CollaborationMessage[] {
  const timestamp = new Date().toLocaleTimeString();

  return [
    {
      id: `${jobId}-msg-1`,
      agentId: "claim-extractor",
      agentName: "Claim Extractor",
      agentRole: "Atomic Claim Decomposition",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzYzg3nCMm8De78_aTJYrPgyPXvYUSwt3UPbRpYkQG6SqDa1cC0lpvDfrADv2MEYDlOzQJzQDqkWLl840zTqPxaBI8_JmoxaE_TdEdarn5e4jaP4eg3OiQXRUd4CgR0LT2LFjygjGO9NtBfOAdQpKiip_eBYxiuSftQdQYuJsPwnfrwVO0uJGO07yFqnMcYI_rmbCV72CbmkGsD4an3FQZH2TL0bUSkEiBhz6_xW-L_I8AJyHwuPzyWbp-6CBaM5BpjP7RNp9BzY3",
      message: `Extracted ${claims.length} testable atomic claims for query: "${query.slice(0, 50)}..."`,
      reasoning: claims.map((c) => `Claim [${c.id}]: ${c.text}`).join("\n"),
      timestamp,
      status: "discovering",
      progress: 100,
      color: "text-blue-600",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      actionPayload: `${claims.length} Claims Parsed`,
    },
    {
      id: `${jobId}-msg-2`,
      agentId: "search-retriever",
      agentName: "Search Retriever",
      agentRole: "Tavily Web Search & FAISS Indexing",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aCbN2eqkgwT6AtFIRaMDQoYRyM0xL4mUxZ_r5q9BFVAPqsar5p9gdZ2Woyhxfi6f8oRZaqbc5vPNHto6rP9SnWmnGtMYRW4CpjppuPCKN6YOIAv7CtnhjSMoWsHZ7Z7aH3-wjGYb1kQmrmLNPaTkXwh3Ra42eVL3s5V2aWcewuwfapCXKuveK1QaAULYjhrJEogaN4yH0pK4Raw1Y3DD9420e5CysiRNXKyqF_iea-M4zD9er4eF2NhlQ0L0aLKjWhFMa_bRWDhr",
      message: `Retrieved ${sources.length} live web sources and indexed evidence vectors into FAISS.`,
      reasoning: sources.map((s) => `[${s.domain || "Web"}]: ${s.title}`).join("\n"),
      timestamp,
      status: "cross-checking",
      progress: 100,
      color: "text-cyan-600",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      actionPayload: `${sources.length} Sources Ingested`,
    },
    {
      id: `${jobId}-msg-3`,
      agentId: "fact-verifier",
      agentName: "Fact Verifier",
      agentRole: "LLM Cross-Verification & Stance Assignment",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTzYzg3nCMm8De78_aTJYrPgyPXvYUSwt3UPbRpYkQG6SqDa1cC0lpvDfrADv2MEYDlOzQJzQDqkWLl840zTqPxaBI8_JmoxaE_TdEdarn5e4jaP4eg3OiQXRUd4CgR0LT2LFjygjGO9NtBfOAdQpKiip_eBYxiuSftQdQYuJsPwnfrwVO0uJGO07yFqnMcYI_rmbCV72CbmkGsD4an3FQZH2TL0bUSkEiBhz6_xW-L_I8AJyHwuPzyWbp-6CBaM5BpjP7RNp9BzY3",
      message: `Evaluated ${claims.length} claims against retrieved evidence. Assigned verdicts and confidence ratings.`,
      reasoning: claims.map((c) => `[${c.verdict || "INCONCLUSIVE"}]: ${c.reasoning || c.text}`).join("\n"),
      timestamp,
      status: "generating",
      progress: 100,
      color: "text-purple-600",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      actionPayload: `${claims.filter((c) => c.verdict === "SUPPORTED").length} Supported Claims`,
    },
    {
      id: `${jobId}-msg-4`,
      agentId: "contradiction-detector",
      agentName: "Contradiction Detector",
      agentRole: "Source Discrepancy & Conflict Analysis",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDav8Y4XXmvw5jLlSh2MsIjZBmu5XNx_93WSGO6XlHI-H-GovcS3r1Swn3XxGoj1mmtP_nPZNm5by4WK_ujOR5N4rak4TNTpppn1UAfMNeq2oy7VDC4-r2YuFaGvCP6w8Q_5M7fI59BZLbY6EvYAfBvcVEOb2ov2ph84edTQQpUau93ntL4YmkpjHAGpry3VWxbSqrU45rIAsZ1fgSikNbHdBbyVtIQMoQ0f0Lsp9BmLljWgVstdpYk1RJwuBjDV7MayOhoSr9eOAHo",
      message: contradictions.length > 0
        ? `Identified ${contradictions.length} discrepancies between web evidence sources.`
        : "No direct source-level contradictions identified across evidence.",
      reasoning: contradictions.map((c) => `[Conflict]: ${c.conflict_description}`).join("\n") || "All sources align on core findings.",
      timestamp,
      status: "detecting",
      progress: 100,
      color: contradictions.length > 0 ? "text-red-600" : "text-emerald-600",
      badgeBg: contradictions.length > 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-800 border-emerald-200",
      actionPayload: `${contradictions.length} Contradictions Detected`,
    },
    {
      id: `${jobId}-msg-5`,
      agentId: "report-generator",
      agentName: "Report Generator",
      agentRole: "Markdown Synthesis & Citation Indexing",
      avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2aCbN2eqkgwT6AtFIRaMDQoYRyM0xL4mUxZ_r5q9BFVAPqsar5p9gdZ2Woyhxfi6f8oRZaqbc5vPNHto6rP9SnWmnGtMYRW4CpjppuPCKN6YOIAv7CtnhjSMoWsHZ7Z7aH3-wjGYb1kQmrmLNPaTkXwh3Ra42eVL3s5V2aWcewuwfapCXKuveK1QaAULYjhrJEogaN4yH0pK4Raw1Y3DD9420e5CysiRNXKyqF_iea-M4zD9er4eF2NhlQ0L0aLKjWhFMa_bRWDhr",
      message: "Final multi-agent research paper synthesized and formatted with citations.",
      reasoning: "Synthesized executive summary, verified claim ledger, source bibliography, and contradiction log.",
      timestamp,
      status: "complete",
      progress: 100,
      color: "text-emerald-600",
      badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
      actionPayload: "Workflow Complete",
    },
  ];
}
