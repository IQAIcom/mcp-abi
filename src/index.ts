import { FastMCP } from "fastmcp";
import { generateTool } from "./tools/generateTool.js";

async function main() {
	console.log("Initializing MCP ABI Server...");

	const server = new FastMCP({
		name: "IQAI ABI MCP Server",
		version: "0.0.1",
	});

	server.addTool(generateTool);

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
