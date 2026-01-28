import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../../..");
const README_PATH = path.join(ROOT, "README.md");

const START = "<!-- AUTO-GENERATED TOOLS START -->";
const END = "<!-- AUTO-GENERATED TOOLS END -->";

/**
 * Generate documentation for mcp-abi's dynamic tool generation
 *
 * mcp-abi generates tools dynamically from contract ABIs at runtime.
 * This means the actual tools depend on which contract ABI is loaded.
 */
function generateDynamicToolDocs() {
	return `
> **Note:** Tools are generated dynamically based on the loaded contract ABI.
> The tool names follow the pattern \`{contractname}_{functionname}\`.

### Dynamic Tool Generation

When you load a contract ABI, tools are automatically created for each function in the ABI:

- **Read functions** become query tools (no gas required)
- **Write functions** become execution tools (requires wallet)

### Common Parameters

All generated tools accept the same parameter schema:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| \`args\` | array | No | \`[]\` | Function arguments as an array. Example: \`["0x123...", 100, true]\` |

### Example Generated Tools

If you load an ERC-20 token contract named "USDC", the following tools would be generated:

- \`usdc_name\` - Query the token name
- \`usdc_symbol\` - Query the token symbol
- \`usdc_decimals\` - Query token decimals
- \`usdc_totalSupply\` - Query total token supply
- \`usdc_balanceOf\` - Query balance of an address
- \`usdc_transfer\` - Transfer tokens to an address
- \`usdc_approve\` - Approve spending allowance
- \`usdc_transferFrom\` - Transfer tokens on behalf of another address

### Tool Response Format

**Read Functions:**
\`\`\`
✅ Successfully queried {functionName}

📊 Result:
{JSON result}
\`\`\`

**Write Functions:**
\`\`\`
✅ Successfully executed {functionName}

🔗 Transaction Hash: {hash}
📦 Block Number: {blockNumber}
⛽ Gas Used: {gasUsed}
✅ Status: Success
\`\`\`
`.trim();
}

function updateReadme(readme) {
	if (!readme.includes(START) || !readme.includes(END)) {
		throw new Error("README missing AUTO-GENERATED TOOLS markers");
	}

	const toolsMd = generateDynamicToolDocs();

	return readme.replace(
		new RegExp(`${START}[\\s\\S]*?${END}`, "m"),
		`${START}\n\n${toolsMd}\n\n${END}`,
	);
}

async function main() {
	try {
		const readme = fs.readFileSync(README_PATH, "utf8");
		const updated = updateReadme(readme);

		fs.writeFileSync(README_PATH, updated);
		console.log("Generated dynamic tool documentation for mcp-abi");
	} catch (error) {
		console.error("Error updating README:", error);
		process.exit(1);
	}
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
