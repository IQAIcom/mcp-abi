# mcp-abi

This project provides a tool for generating ABI files from TypeScript code that defines Model Context Protocol (MCP) tools. It simplifies the process of creating ABI files, which are necessary for interacting with MCP servers.

## Features

- Generates ABI files from TypeScript code.
- Supports defining MCP tools and their parameters in TypeScript.
- Simplifies the development of MCP servers.

## Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/IQAIcom/mcp-abi.git
    cd mcp-abi
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

## Usage

1.  Define your MCP tools in TypeScript. For example:

    ```typescript
    // src/tools/exampleTool.ts
    import { MCPServer } from "..";

    const ExampleTool = MCPServer.defineTool(
      "exampleTool",
      "A simple example tool",
      {
        input: {
          name: {
            type: "string",
            description: "The name to greet",
          },
        },
        output: {
          greeting: {
            type: "string",
            description: "A greeting message",
          },
        },
      },
      async ({ name }) => {
        return { greeting: `Hello, ${name}!` };
      }
    );

    export default ExampleTool;
    ```

2.  Use the `generateTool` tool to generate the ABI file:

    ```bash
    pnpm run generateTool src/tools/exampleTool.ts abi/exampleTool.abi.json
    ```

    This command will read the TypeScript file `src/tools/exampleTool.ts` and generate the ABI file `abi/exampleTool.abi.json`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

MIT
