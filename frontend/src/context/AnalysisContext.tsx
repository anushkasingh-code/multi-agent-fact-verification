import React, { createContext, useContext, useState, useEffect } from "react";
import { AnalyzeResponse, BackendClaim, BackendSource, BackendContradiction } from "../api/types";
import { ClaimItem, GraphNode, GraphEdge, CollaborationMessage, ResearchResult, VaultItem } from "../types";
import { transformAnalyzeResponseToResearchResult } from "../api/reports";
import { transformStateToCollaborationMessages } from "../api/agents";

interface AnalysisContextType {
  latestResponse: AnalyzeResponse | null;
  setLatestResponse: (response: AnalyzeResponse | null) => void;
  selectedModelProvider: string;
  setSelectedModelProvider: (provider: string) => void;
  vaultItems: VaultItem[];
  addVaultItem: (item: VaultItem) => void;
  deleteVaultItem: (id: string) => void;
  // Computed views derived from active backend data
  computedResearchResult: ResearchResult | null;
  computedClaims: ClaimItem[];
  computedGraphNodes: GraphNode[];
  computedGraphEdges: GraphEdge[];
  computedCollaborationMessages: CollaborationMessage[];
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

const LOCAL_STORAGE_VAULT_KEY = "verisphere_vault_items";
const LOCAL_STORAGE_MODEL_KEY = "verisphere_model_provider";

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [latestResponse, setLatestResponse] = useState<AnalyzeResponse | null>(null);
  const [selectedModelProvider, setSelectedModelProvider] = useState<string>(() => {
    return localStorage.getItem(LOCAL_STORAGE_MODEL_KEY) || "openai";
  });

  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_VAULT_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_VAULT_KEY, JSON.stringify(vaultItems));
    } catch (e) {
      console.warn("Failed to save vault items to localStorage:", e);
    }
  }, [vaultItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_MODEL_KEY, selectedModelProvider);
    } catch (e) {
      console.warn("Failed to save model provider to localStorage:", e);
    }
  }, [selectedModelProvider]);

  const addVaultItem = (item: VaultItem) => {
    setVaultItems((prev) => [item, ...prev.filter((i) => i.id !== item.id)]);
  };

  const deleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Compute ResearchResult from real backend response if available
  const computedResearchResult: ResearchResult | null = latestResponse
    ? transformAnalyzeResponseToResearchResult(latestResponse)
    : null;

  // Compute ClaimItems from backend claims if available
  const computedClaims: ClaimItem[] = (latestResponse?.claims || []).map((c: BackendClaim, index: number) => {
    const verdictUpper = (c.verdict || "INCONCLUSIVE").toUpperCase();
    let status: "VERIFIED" | "PARTIALLY_VERIFIED" | "CONTRADICTED" = "PARTIALLY_VERIFIED";
    if (verdictUpper === "SUPPORTED") status = "VERIFIED";
    else if (verdictUpper === "REFUTED") status = "CONTRADICTED";

    const confidenceScore = c.confidence != null ? Math.round(c.confidence * 100) : (status === "VERIFIED" ? 95 : 60);

    const supportingSources = (latestResponse?.sources || [])
      .filter((s: BackendSource) => (c.supporting_sources || []).includes(s.id))
      .map((s: BackendSource) => ({
        title: s.title || s.url,
        source: s.domain || "Web Source",
        url: s.url,
        reliability: Math.round((s.score || 0.8) * 100),
      }));

    const contradictingSources = (latestResponse?.sources || [])
      .filter((s: BackendSource) => (c.contradicting_sources || []).includes(s.id))
      .map((s: BackendSource) => ({
        title: s.title || s.url,
        source: s.domain || "Web Source",
        url: s.url,
        flaw: "Source contradicts claim premise.",
      }));

    return {
      id: c.id || `claim-${index + 1}`,
      claimText: c.text,
      status,
      confidence: confidenceScore,
      evidenceCount: (c.supporting_sources?.length || 0) + (c.contradicting_sources?.length || 0),
      supportingSourcesCount: c.supporting_sources?.length || 0,
      supportingSources,
      contradictingSources,
      reasoning: c.reasoning || "Verified against retrieved Tavily evidence.",
      aiExplanation: c.reasoning || "Deductive verdict derived from multi-agent synthesis.",
      citations: supportingSources.map((s) => s.url),
      confidenceHistory: [
        { timestamp: "0.0s", score: 50 },
        { timestamp: "1.5s", score: confidenceScore },
      ],
    };
  });

  // Compute Knowledge Graph Nodes & Edges from backend analysis
  const computedGraphNodes: GraphNode[] = [];
  const computedGraphEdges: GraphEdge[] = [];

  if (latestResponse) {
    // Topic Node
    computedGraphNodes.push({
      id: "node-topic",
      label: latestResponse.query,
      type: "topic",
      status: "topic",
      credibilityScore: computedResearchResult?.veracityScore || 90,
      pubDate: new Date().toISOString().split("T")[0],
      extractedClaims: (latestResponse.claims || []).map((c) => c.text),
      x: 50,
      y: 45,
      summary: `Research analysis for query: "${latestResponse.query}"`,
      supportingEvidence: `${latestResponse.sources?.length || 0} primary web sources indexed.`,
      citation: `Job ID: ${latestResponse.job_id}`,
      confidence: computedResearchResult?.veracityScore || 90,
      relationships: [],
    });

    // Claim Nodes
    (latestResponse.claims || []).forEach((c, idx) => {
      const nodeId = `node-claim-${idx + 1}`;
      const verdict = (c.verdict || "INCONCLUSIVE").toUpperCase();
      let status: "verified" | "partially" | "contradicted" = "partially";
      if (verdict === "SUPPORTED") status = "verified";
      else if (verdict === "REFUTED") status = "contradicted";

      const angle = (idx / Math.max(1, latestResponse.claims.length)) * 2 * Math.PI;
      const radius = 30;
      const x = Math.round(50 + radius * Math.cos(angle));
      const y = Math.round(45 + radius * Math.sin(angle));

      computedGraphNodes.push({
        id: nodeId,
        label: `Claim #${idx + 1}: ${c.text.slice(0, 30)}...`,
        type: "claim",
        status,
        credibilityScore: c.confidence != null ? Math.round(c.confidence * 100) : 80,
        pubDate: new Date().toISOString().split("T")[0],
        extractedClaims: [c.text],
        x: Math.max(15, Math.min(85, x)),
        y: Math.max(15, Math.min(85, y)),
        summary: c.text,
        supportingEvidence: c.reasoning || "Extracted claim verified against live search evidence.",
        citation: `Claim ID: ${c.id}`,
        confidence: c.confidence != null ? Math.round(c.confidence * 100) : 80,
        relationships: ["node-topic"],
      });

      computedGraphEdges.push({
        id: `edge-topic-${nodeId}`,
        source: "node-topic",
        target: nodeId,
        status: status === "verified" ? "verified" : status === "contradicted" ? "contradicted" : "partially",
      });
    });

    // Source Nodes
    (latestResponse.sources || []).slice(0, 4).forEach((s, idx) => {
      const nodeId = `node-source-${idx + 1}`;
      computedGraphNodes.push({
        id: nodeId,
        label: s.title || s.domain || `Source ${idx + 1}`,
        type: "paper",
        status: "verified",
        credibilityScore: Math.round((s.score || 0.85) * 100),
        pubDate: new Date().toISOString().split("T")[0],
        extractedClaims: [s.snippet.slice(0, 80) + "..."],
        x: Math.round(20 + idx * 20),
        y: 80,
        summary: s.snippet,
        supportingEvidence: `URL: ${s.url}`,
        citation: s.url,
        confidence: Math.round((s.score || 0.85) * 100),
        relationships: ["node-topic"],
      });

      computedGraphEdges.push({
        id: `edge-topic-${nodeId}`,
        source: "node-topic",
        target: nodeId,
        status: "verified",
      });
    });
  }

  // Compute Collaboration Messages from backend response if available
  const computedCollaborationMessages: CollaborationMessage[] = latestResponse
    ? transformStateToCollaborationMessages(
        latestResponse.query,
        latestResponse.claims,
        latestResponse.sources,
        latestResponse.contradictions,
        latestResponse.job_id
      )
    : [];

  return (
    <AnalysisContext.Provider
      value={{
        latestResponse,
        setLatestResponse,
        selectedModelProvider,
        setSelectedModelProvider,
        vaultItems,
        addVaultItem,
        deleteVaultItem,
        computedResearchResult,
        computedClaims,
        computedGraphNodes,
        computedGraphEdges,
        computedCollaborationMessages,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = (): AnalysisContextType => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error("useAnalysisContext must be used within an AnalysisProvider");
  }
  return context;
};
