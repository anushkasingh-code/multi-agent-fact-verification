/**
 * Backend API Type Definitions & Models
 * Synchronized with FastAPI schemas in backend/app/schemas and backend/app/graph/state.py
 */

export interface BackendClaim {
  id: string;
  text: string;
  category: string;
  verdict?: "SUPPORTED" | "REFUTED" | "INCONCLUSIVE" | string | null;
  confidence?: number | null;
  reasoning?: string | null;
  supporting_sources: string[];
  contradicting_sources: string[];
}

export interface BackendSource {
  id: string;
  url: string;
  title: string;
  snippet: string;
  domain?: string | null;
  score?: number | null;
}

export interface BackendContradiction {
  claim_id: string;
  source_a_id: string;
  source_b_id: string;
  conflict_description: string;
}

export interface AnalysisSummary {
  total_claims: number;
  supported_claims: number;
  refuted_claims: number;
  inconclusive_claims: number;
  total_sources: number;
  contradictions_detected: number;
}

export interface AnalyzeRequest {
  query: string;
  model_provider?: "claude" | "openai" | "gemini" | string | null;
}

export interface AnalyzeResponse {
  job_id: string;
  status: "completed" | "failed" | string;
  query: string;
  created_at: string;
  completed_at?: string | null;
  summary: AnalysisSummary;
  claims: BackendClaim[];
  sources: BackendSource[];
  contradictions: BackendContradiction[];
  report_markdown?: string | null;
  errors: string[];
}

export interface HealthResponse {
  status: string;
  mongodb: string;
  timestamp: string;
}

export interface AuthTokens {
  accessToken?: string;
  tokenType?: string;
}

export interface UserPreferences {
  modelProvider?: string;
  strictness?: "balanced" | "high" | "extreme";
  autoArchive?: boolean;
}
