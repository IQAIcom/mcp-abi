import dedent from "dedent";
import type { Tool } from "fastmcp";
import { z } from "zod";
import type { ContractService } from "../services/contract.js";
import type { FunctionMetadata } from "../types.js";

// Schema for contract function parameters
const ContractFunctionParams = z.object({
	args: z
		.array(z.any())
		.optional()
		.default([])
		.describe(
			'Function arguments as an array. Example: ["0x123...", 100, true]',
		),
});

export function generateToolsFromAbi(
	contractService: ContractService,
	contractName: string,
	functions: FunctionMetadata[],
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
): Tool<any, typeof ContractFunctionParams>[] {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const tools: Tool<any, typeof ContractFunctionParams>[] = [];

	for (const func of functions) {
		const toolName = `${contractName.toLowerCase()}_${func.name}`;

		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const tool: Tool<any, typeof ContractFunctionParams> = {
			name: toolName,
			description: dedent`
				${func.isReadFunction ? "Query" : "Execute"} the ${func.name} function on ${contractName} contract.
				${func.description ? `\n${func.description}` : ""}
				${func.inputs?.length ? `\nInputs: ${func.inputs.map((input) => `${input.name} (${input.type})`).join(", ")}` : ""}
				${func.outputs?.length ? `\nOutputs: ${func.outputs.map((output) => `${output.name || "result"} (${output.type})`).join(", ")}` : ""}
			`,
			parameters: ContractFunctionParams,
			execute: async (params, context) => {
				console.log(
					`[${toolName}] Called with function ${func.name}, params:`,
					params,
				);

				try {
					const { args = [] } = params;

					// Validate argument count if function metadata includes input info
					if (func.inputs && args.length !== func.inputs.length) {
						throw new Error(
							`Expected ${func.inputs.length} arguments, got ${args.length}. ` +
								`Required: ${func.inputs.map((i) => `${i.name} (${i.type})`).join(", ")}`,
						);
					}

					if (func.isReadFunction) {
						const result = await contractService.callReadFunction(
							func.name,
							args,
						);

						return dedent`
							✅ Successfully queried ${func.name}
							
							📊 Result:
							\`\`\`json
							${JSON.stringify(result, null, 2)}
							\`\`\`
						`;
						// biome-ignore lint/style/noUselessElse: <explanation>
					} else {
						const { hash, receipt } = await contractService.callWriteFunction(
							func.name,
							args,
						);

						return dedent`
							✅ Successfully executed ${func.name}
							
							🔗 Transaction Hash: \`${hash}\`
							📦 Block Number: ${receipt.blockNumber}
							⛽ Gas Used: ${receipt.gasUsed.toString()}
							✅ Status: ${receipt.status === "success" ? "Success" : "Failed"}
							
							💡 You can view this transaction on the blockchain explorer.
						`;
					}
				} catch (error: unknown) {
					const message =
						error instanceof Error
							? error.message
							: "An unknown error occurred during the transaction.";

					console.error(`[${toolName}] Error:`, error);

					// Return error message instead of throwing for better UX
					return dedent`
						❌ Failed to ${func.isReadFunction ? "query" : "execute"} ${func.name}
						
						🔍 Error: ${message}
						
						💡 Please check your arguments and try again.
					`;
				}
			},
		};

		tools.push(tool);
	}

	return tools;
}
