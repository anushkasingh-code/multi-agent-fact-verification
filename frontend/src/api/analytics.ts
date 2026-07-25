import apiClient from "./client";
import { HealthResponse } from "./types";

/**
 * Fetches the system health status from backend GET /api/v1/health.
 */
export async function fetchHealthCheck(): Promise<HealthResponse> {
  const response = await apiClient.get<HealthResponse>("/api/v1/health");
  return response.data;
}
