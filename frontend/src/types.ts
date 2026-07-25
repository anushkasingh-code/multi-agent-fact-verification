export type NavigationTab = 
  | "dashboard" 
  | "collaboration" 
  | "graph" 
  | "timeline" 
  | "confidence" 
  | "agents" 
  | "research" 
  | "vault";

export interface Agent {
  id: string;
  name: string;
  role: string;
  type: "scraper" | "analyst" | "critic" | "validator" | "synthesizer";
  status: "active" | "idle" | "processing" | "verifying";
  description: string;
  accuracy: number;
  tasksCompleted: number;
  iconName: string;
  color: string;
  badgeBg: string;
  enabled: boolean;
  capabilities: string[];
}

export interface CollaborationMessage {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  avatar: string;
  message: string;
  reasoning: string;
  timestamp: string;
  status: "discovering" | "cross-checking" | "detecting" | "generating" | "updating" | "complete";
  progress: number; // 0 to 100
  color: string;
  badgeBg: string;
  actionPayload?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "topic" | "claim" | "paper" | "news" | "government";
  status: "verified" | "partially" | "contradicted" | "topic";
  credibilityScore: number;
  pubDate: string;
  extractedClaims: string[];
  x: number; // percentage or SVG coordinate
  y: number;
  summary: string;
  supportingEvidence: string;
  citation: string;
  confidence: number;
  relationships: string[];
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  status?: "verified" | "partially" | "contradicted" | "neutral";
}

export interface ClaimItem {
  id: string;
  claimText: string;
  status: "VERIFIED" | "PARTIALLY_VERIFIED" | "CONTRADICTED";
  confidence: number;
  evidenceCount: number;
  supportingSourcesCount: number;
  supportingSources: { title: string; source: string; url: string; reliability: number }[];
  contradictingSources: { title: string; source: string; url: string; flaw: string }[];
  reasoning: string;
  aiExplanation: string;
  citations: string[];
  confidenceHistory: { timestamp: string; score: number }[];
  isVerifying?: boolean;
}

export interface ConfidenceMetric {
  id: string;
  title: string;
  score: number; // 0 to 100
  previousScore?: number;
  explanation: string;
  statusText: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  iconName: string;
}

export interface ResearchQuery {
  id: string;
  query: string;
  depth: "quick" | "standard" | "deep";
  strictness: "low" | "medium" | "high";
  timestamp: string;
}

export interface AgentLog {
  agent: string;
  message: string;
  timestamp?: string;
  status?: "info" | "success" | "warning" | "error";
}

export interface Citation {
  ref: string;
  title: string;
  url: string;
  publisher?: string;
  year?: string;
  doi?: string;
}

export interface ResearchResult {
  id: string;
  query: string;
  veracityScore: number;
  status: "VERIFIED" | "PARTIALLY_VERIFIED" | "NEEDS_REVISION";
  hallucinationsCaught: number;
  sourcesConsulted: number;
  agentLogs: AgentLog[];
  findings: string;
  citations: Citation[];
  timestamp: string;
  category?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: "success" | "warning" | "info";
}

export interface VaultItem {
  id: string;
  title: string;
  query: string;
  domain: string;
  veracityScore: number;
  citationsCount: number;
  date: string;
  status: "VERIFIED" | "PARTIALLY_VERIFIED";
  findingsPreview: string;
}
