# MCP-ABI: Model Context Protocol Server for Smart Contract ABI Interactions

This project implements a Model Context Protocol (MCP) server to interact with Ethereum-compatible smart contracts using their ABI (Application Binary Interface). It allows MCP-compatible clients (like AI assistants, IDE extensions, or custom applications) to dynamically generate and execute smart contract interactions based on contract ABIs.

This server is built using TypeScript and `fastmcp`.

## Features (MCP Tools)

The server dynamically exposes tools based on the provided contract ABI. Each function in the ABI becomes an available MCP tool:

- **Read Functions (view/pure)**: Query contract state without sending transactions
  - Example: `CONTRACT_BALANCE_OF`, `CONTRACT_TOTAL_SUPPLY`, `CONTRACT_NAME`
  - Parameters: Function-specific parameters as defined in the ABI
- **Write Functions**: Execute state-changing transactions on the contract
  - Example: `CONTRACT_TRANSFER`, `CONTRACT_APPROVE`, `CONTRACT_MINT`
  - Parameters: Function-specific parameters as defined in the ABI
  - Requires `WALLET_PRIVATE_KEY` in the environment

All tools are automatically prefixed with the contract name (e.g., `ERC20_TRANSFER` for an ERC20 contract).

## Prerequisites

- Node.js (v18 or newer recommended)
- pnpm (See <https://pnpm.io/installation>)

## Installation

There are a few ways to use `mcp-abi`:

**1. Using `pnpm dlx` (Recommended for most MCP client setups):**

You can run the server directly using `pnpm dlx` without needing a global installation. This is often the easiest way to integrate with MCP clients. See the "Running the Server with an MCP Client" section for examples.
(`pnpm dlx` is pnpm's equivalent of `npx`)

**2. Global Installation from npm (via pnpm):**

Install the package globally to make the `mcp-abi` command available system-wide:

```bash
pnpm add -g @iqai/mcp-abi
```

**3. Building from Source (for development or custom modifications):**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/IQAIcom/mcp-abi.git
    cd mcp-abi
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

- **`WALLET_PRIVATE_KEY`**: (Required for write functions)

  - The private key of the wallet to be used for signing and sending transactions to the blockchain.
  - **Security Note:** Handle this private key with extreme care. Ensure it is stored securely and only provided to trusted MCP client configurations.

- **`CONTRACT_ABI`**: (Required)

  - The JSON string representation of the contract's ABI.
  - This defines which functions will be available as MCP tools.

- **`CONTRACT_ADDRESS`**: (Required)

  - The deployed contract address on the blockchain.

- **`CONTRACT_NAME`**: (Optional, defaults to "CONTRACT")

  - A friendly name for the contract, used as a prefix for generated tool names.

- **`CHAIN_ID`**: (Optional, defaults to Fraxtal)

  - The blockchain network chain ID to interact with.

- **`RPC_URL`**: (Optional)
  - Custom RPC endpoint URL. If not provided, uses default RPC for the specified chain.

## Running the Server with an MCP Client

MCP clients (like AI assistants, IDE extensions, etc.) will run this server as a background process. You need to configure the client to tell it how to start your server.

Below is an example configuration snippet that an MCP client might use (e.g., in a `mcp_servers.json` or similar configuration file). This example shows how to run the server using the published npm package via `pnpm dlx`.

```json
{
  "mcpServers": {
    "smart-contract-abi": {
      "command": "pnpm",
      "args": ["dlx", "@iqai/mcp-abi"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "CONTRACT_ABI": "[{\"inputs\":[{\"name\":\"to\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
        "CONTRACT_ADDRESS": "0xaB195B090Cc60C1EFd4d1cEE94Bf441F5931C01b",
        "CONTRACT_NAME": "ERC20",
        "CHAIN_ID": "252",
        "RPC_URL": "https://rpc.frax.com"
      }
    }
  }
}
```

**Alternative if Globally Installed:**

If you have installed `mcp-abi` globally (`pnpm add -g @iqai/mcp-abi`), you can simplify the `command` and `args`:

```json
{
  "mcpServers": {
    "smart-contract-abi": {
      "command": "mcp-abi",
      "args": [],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "CONTRACT_ABI": "[{\"inputs\":[{\"name\":\"to\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
        "CONTRACT_ADDRESS": "0xaB195B090Cc60C1EFd4d1cEE94Bf441F5931C01b",
        "CONTRACT_NAME": "ERC20",
        "CHAIN_ID": "252"
      }
    }
  }
}
```

- **`command`**: The executable to run.
  - For `pnpm dlx`: `"pnpm"` (with `"dlx"` as the first arg)
  - For global install: `"mcp-abi"`
- **`args`**: An array of arguments to pass to the command.
  - For `pnpm dlx`: `["dlx", "@iqai/mcp-abi"]`
  - For global install: `[]`
- **`env`**: An object containing environment variables to be set when the server process starts. This is where you provide `WALLET_PRIVATE_KEY`, `CONTRACT_ABI`, `CONTRACT_ADDRESS`, and other configuration options.

## Example Usage Scenarios

**ERC20 Token Contract:**

- Check token balance: Use `ERC20_BALANCE_OF` tool with an address parameter
- Transfer tokens: Use `ERC20_TRANSFER` tool with recipient address and amount
- Check allowances: Use `ERC20_ALLOWANCE` tool with owner and spender addresses
- Approve spending: Use `ERC20_APPROVE` tool with spender address and amount

**NFT Contract (ERC721):**

- Check token ownership: Use `NFT_OWNER_OF` tool with token ID
- Transfer NFT: Use `NFT_TRANSFER_FROM` tool with from address, to address, and token ID
- Mint new token: Use `NFT_MINT` tool with recipient address and token metadata

## Response Format

**Read Functions:**

```
✅ Successfully called balanceOf
Result: "1000000000000000000"
```

**Write Functions:**

```
✅ Successfully executed transfer
Transaction hash: 0x123abc...
You can view this transaction on the blockchain explorer.
```

## Error Handling

The server provides comprehensive error handling for various blockchain interaction scenarios:

- 🚨 **Invalid function arguments** - "❌ Error parsing arguments: [specific error]"
- 🔄 **Transaction failures** - "❌ Error with [function]: [error message]"
- 🔒 **Access control errors** - "❌ Error with [function]: execution reverted"
- 🌐 **Network errors** - "❌ Error with [function]: network connection failed"
- 💲 **Insufficient funds** - "❌ Error with [function]: insufficient funds for gas"
- 📄 **ABI parsing errors** - "❌ Invalid ABI format: [specific error]"
- 🏠 **Contract address errors** - "❌ Invalid contract address: [address]"

## Security Considerations

- Store private keys securely and never commit them to version control
- Use environment variables for sensitive configuration
- Validate all contract interactions before execution
- Consider using hardware wallets or secure key management solutions for production use
- Always test interactions on testnets before mainnet deployment
