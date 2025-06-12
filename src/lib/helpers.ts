import type { Abi, AbiFunction } from "viem";
import type { FunctionMetadata } from "../types.js";

export function extractFunctionsFromAbi(abi: Abi): FunctionMetadata[] {
	return abi
		.filter((item): item is AbiFunction => item.type === "function")
		.map((item) => ({
			name: item.name,
			stateMutability: item.stateMutability,
			inputs: item.inputs || [],
			outputs: item.outputs || [],
			isReadFunction:
				item.stateMutability === "view" || item.stateMutability === "pure",
		}));
}

export function formatResult(result: unknown): unknown {
	if (typeof result === "bigint") {
		return result.toString();
	}
	if (Array.isArray(result)) {
		return result.map(formatResult);
	}
	if (result && typeof result === "object") {
		const formatted: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(result)) {
			formatted[key] = formatResult(value);
		}
		return formatted;
	}
	return result;
}

export async function withRetry<T>(
	fn: () => Promise<T>,
	options: { maxRetries?: number; logPrefix?: string } = {},
): Promise<T> {
	const { maxRetries = 3, logPrefix = "Operation" } = options;

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			return await fn();
		} catch (error) {
			console.log(`[${logPrefix}] Attempt ${attempt} failed:`, error);

			if (attempt === maxRetries) {
				throw error;
			}

			const delay = 2 ** (attempt - 1) * 1000;
			await new Promise((resolve) => setTimeout(resolve, delay));
		}
	}

	throw new Error("Unreachable");
}
