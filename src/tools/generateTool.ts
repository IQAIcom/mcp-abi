import dedent from "dedent";
import { z } from "zod";
import type { ContractService } from "../services/contract.js";
import type { FunctionMetadata } from "../types.js";
import type { Tools } from "../types.js";


const GenerateToolParams = z.object({
	contractName: z
		.string()
		.describe("The name of the contract to interact with."),
	chainId: z
		.number()
		.int()
		.positive()
		.optional()
		.describe("Optional chain ID associated with this log entry."),
});


export function generateToolsFromAbi(
	contractService: ContractService,
	contractName: string,
	functions: FunctionMetadata[],
): Tools[] {
	const tools: Tools[] = [];
	for(const func of functions){
		const toolName = `${contractName.toUpperCase()}_${func.name.toUpperCase()}`;

		const tool = {
			name: toolName,
			description: `${func.isReadFunction ? "Query" : "Execute"} the ${func.name} function on ${contractName} contract`,
			execute: async (args: string) => {
				console.log(
					`[${toolName}] Called with function ${func.name}, args: ${args}`,
				);

				try {
					let parsedArgs: any[] = [];
					try {
						parsedArgs = JSON.parse(args);
						if (!Array.isArray(parsedArgs)) {
							throw new Error("Arguments must be a JSON array.");
						}
					} catch (error: any) {
						throw new Error(`Failed to parse arguments: ${error.message}`);
					}
					
					if (func.isReadFunction) {
						const result = await contractService.callReadFunction(
							func.name,
							parsedArgs,
						);

						// return dedent`✅ Successfully called ${func.name} Result: ${JSON.stringify(result, null, 2)}`;
					} else {
						const { hash } = await contractService.callWriteFunction(
							func.name,
							parsedArgs,
						);

						return dedent`
							✅ Successfully executed ${func.name}

							Transaction hash: ${hash}

							You can view this transaction on the blockchain explorer.
						`;
					}
				} catch (error: unknown) {
					const message =
						error instanceof Error
							? error.message
							: "An unknown error occurred during the transaction.";
					console.log(`[${toolName}] Error: ${message}`);
					throw new Error(`Failed to execute function ${func.name}: ${message}`);
				}
			},
		};
		tools.push(tool);
	}
	return tools;
}
