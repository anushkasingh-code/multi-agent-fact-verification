import apiClient from "./client";
import { AnalyzeRequest, AnalyzeResponse } from "./types";

/**
 * Executes the Autonomous Multi-Agent workflow for research query fact verification.
 * Calls backend POST /api/v1/analyze.
 */
export async function executeResearchAnalysis(payload: AnalyzeRequest): Promise<AnalyzeResponse> {
  const response = await apiClient.post<AnalyzeResponse>("/api/v1/analyze", payload);
  return response.data;
}
