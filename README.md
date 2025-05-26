# MCP-Fraxlend: Model Context Protocol Server for Fraxlend

This project implements a Model Context Protocol (MCP) server to interact with the Fraxlend platform. It allows MCP-compatible clients (like AI assistants, IDE extensions, or custom applications) to access Fraxlend functionalities such as viewing lending statistics, lending, borrowing, adding/removing collateral, repaying and withdrawing.

This server is built using TypeScript and `fastmcp`.

## Features (MCP Tools)

The server exposes the following tools that MCP clients can utilize:

- **`LENDING_STATS`**: Fetch statistics for a specific Fraxlend pair.
  - Parameters: `pairAddress` (string)
- **`LEND`**: Lend assets to a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`BORROW`**: Borrow assets from a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`ADD_COLLATERAL`**: Add collateral to a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`REMOVE_COLLATERAL`**: Remove collateral from a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`REPAY`**: Repay borrowed assets to a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`WITHDRAW`**: Withdraw lent assets from a specific Fraxlend pair.
  - Parameters: `pairAddress` (string), `amount` (string)
  - Requires `WALLET_PRIVATE_KEY` in the environment.
- **`PAIR_ADDRESS`**: Get the pair address for a specific Fraxlend pair.
  - Parameters: `collateralToken` (string), `borrowedToken` (string)

## Prerequisites

- Node.js (v18 or newer recommended)
- pnpm (See <https://pnpm.io/installation>)

## Installation

There are a few ways to use `mcp-fraxlend`:

**1. Using `pnpm dlx` (Recommended for most MCP client setups):**

You can run the server directly using `pnpm dlx` without needing a global installation. This is often the easiest way to integrate with MCP clients. See the "Running the Server with an MCP Client" section for examples.
(`pnpm dlx` is pnpm's equivalent of `npx`)

**2. Global Installation from npm (via pnpm):**

Install the package globally to make the `mcp-fraxlend` command available system-wide:

```bash
pnpm add -g @iqai/mcp-fraxlend
```

**3. Building from Source (for development or custom modifications):**

1.  **Clone the repository:**

```bash
git clone https://github.com/IQAIcom/mcp-fraxlend.git
cd mcp-fraxlend
```

2.  **Install dependencies:**

```bash
pnpm install
```

3.  **Build the server:**
    This compiles the TypeScript code to JavaScript in the `dist` directory.

```bash
pnpm run build
```

The `prepare` script also runs `pnpm run build`, so dependencies are built upon installation if you clone and run `pnpm install`.

## Configuration (Environment Variables)

This MCP server requires certain environment variables to be set by the MCP client that runs it. These are typically configured in the client's MCP server definition (e.g., in a `mcp.json` file for Cursor, or similar for other clients).

- **`WALLET_PRIVATE_KEY`**: (Required for `LEND`, `BORROW`, `ADD_COLLATERAL`, `REMOVE_COLLATERAL`, `REPAY`, `WITHDRAW`)
  - The private key of the wallet to be used for interacting with the Fraxlend platform (e.g., signing transactions for lending, borrowing, etc.).
  - **Security Note:** Handle this private key with extreme care. Ensure it is stored securely and only provided to trusted MCP client configurations.

## Running the Server with an MCP Client

MCP clients (like AI assistants, IDE extensions, etc.) will run this server as a background process. You need to configure the client to tell it how to start your server.

Below is an example configuration snippet that an MCP client might use (e.g., in a `mcp_servers.json` or similar configuration file). This example shows how to run the server using the published npm package via `pnpm dlx`.

```json
{
  "mcpServers": {
    "iq-fraxlend-mcp-server": {
      "command": "pnpm",
      "args": ["dlx", "@iqai/mcp-fraxlend"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

**Alternative if Globally Installed:**

If you have installed `mcp-fraxlend` globally (`pnpm add -g @iqai/mcp-fraxlend`), you can simplify the `command` and `args`:

```json
{
  "mcpServers": {
    "iq-fraxlend-mcp-server": {
      "command": "mcp-fraxlend",
      "args": [],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here"
      }
    }
  }
}
```

- **`command`**: The executable to run.
  - For `pnpm dlx`: `"pnpm"` (with `"dlx"` as the first arg)
  - For global install: `"mcp-fraxlend"`
- **`args`**: An array of arguments to pass to the command.
  - For `pnpm dlx`: `["dlx", "@iqai/mcp-fraxlend"]`
  - For global install: `[]`
- **`env`**: An object containing environment variables to be set when the server process starts. This is where you provide `WALLET_PRIVATE_KEY`
- **`workingDirectory`**: Generally not required when using the published package via `pnpm dlx` or a global install, as the package should handle its own paths correctly. If you were running from source (`node dist/index.js`), then setting `workingDirectory` to the project root would be important.
