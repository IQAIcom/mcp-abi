import { FastMCP } from "fastmcp";
import { ContractService } from "./services/contract.js";
import { generateToolsFromAbi } from "./tools/generateTool.js";
import { extractFunctionsFromAbi } from "./lib/helpers.js";
import { DEFAULT_CHAIN } from "./lib/constants.js";
import type { AbiPluginOptions } from "./types.js";

async function main() {
	console.log("Initializing MCP ABI Server...");

	const server = new FastMCP({
		name: "IQAI ABI MCP Server",
		version: "0.0.1",
	});

	const options: AbiPluginOptions;

	const {
		abi,
		contractName,
		contractAddress,
		privateKey,
		chain = DEFAULT_CHAIN,
	} = options;

	const contractService = new ContractService(
		abi,
		contractAddress,
		privateKey,
		chain,
	);

	const functions = extractFunctionsFromAbi(abi);

	if (functions.length === 0) {
		throw new Error("No callable functions found in the provided ABI");
	}

	const tools = generateToolsFromAbi(
		contractService,
		contractName,
		functions,
	);

	server.addTool(tools);

	// server.addTool(generateTool);

	try {
		await server.start({
			transportType: "stdio",
		});
		console.log("✅ IQ ABI MCP Server started successfully over stdio.");
		console.log("You can now connect to it using an MCP client.");
	} catch (error) {
		console.error("❌ Failed to start IQ ABI MCP Server:", error);
		process.exit(1);
	}
}

main().catch((error) => {
	console.error("❌ An unexpected error occurred:", error);
	process.exit(1);
});
