import { encoding_for_model } from '@dqbd/tiktoken';
import { text } from 'stream/consumers';

// Rough fallback = words × 1.33 (≈ tokens / word)

const roughEstimate = (text: string) =>
  Math.ceil(text.trim().split(/\s+/).length * 1.33);

/**
 * Counts tokens for a given model. Falls back to rough estimate
 * if the encoder wasm bundle is missing (first cold-start on Lambda, etc.).
 */

export function countTokens(text: string, model = 'gpt-4o-mini'): number {
  try {
    const enc = encoding_for_model(model as any);
    const tokens = enc.encode(text);
    enc.free();
    return tokens.length;
  } catch {
    return roughEstimate(text);
  }
}
/**
 * Estimates OpenAI cost (USD) for the given token counts.
 * Adjust prices here if OpenAI updates them.
 */
export function estimateOpenAiCost(
  inputTokens: number,
  outputTokens: number,
  price = {
    inputPer1k: 0.0003, // gpt-4o-mini input price
    outputPer1k: 0.0005, // gpt-4o-mini output price
  },
) {
  const inputCost = (inputTokens / 1000) * price.inputPer1k;
  const outputCost = (outputTokens / 1000) * price.outputPer1k;
  return +(inputCost + outputCost).toFixed(6); // 6-dp for safety
}
