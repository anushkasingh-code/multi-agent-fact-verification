import { BackendSource } from "./types";
import { Citation } from "../types";

/**
 * Extracts and formats citation items from backend Source objects.
 */
export function extractCitationsFromSources(sources: BackendSource[]): Citation[] {
  return (sources || []).map((source, index) => ({
    ref: `[${index + 1}]`,
    title: source.title || source.url,
    url: source.url,
    publisher: source.domain || "Web",
  }));
}
