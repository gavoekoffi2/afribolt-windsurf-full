import { logger } from "./logger";

/**
 * Safely parse JSON from LLM responses, handling markdown code blocks
 * and returning a fallback value on failure.
 */
export function safeParseJSON<T>(content: string, fallback: T): T {
  try {
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : content.trim();
    return JSON.parse(jsonStr) as T;
  } catch {
    logger.warn("Failed to parse LLM JSON response, using fallback");
    return fallback;
  }
}
