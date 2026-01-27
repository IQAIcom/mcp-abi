# 🔗 ABI MCP Server

[![npm version](https://img.shields.io/npm/v/@iqai/mcp-abi.svg)](https://www.npmjs.com/package/@iqai/mcp-abi)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📖 Overview

The ABI MCP Server enables AI agents to interact with any Ethereum-compatible smart contract using its ABI (Application Binary Interface). This server dynamically generates MCP tools from contract ABIs, allowing seamless interaction with any smart contract without requiring custom tool implementations.

By implementing the Model Context Protocol (MCP), this server allows Large Language Models (LLMs) to read contract state, execute transactions, and interact with decentralized applications directly through their context window.

## ✨ Features

*   **Dynamic Tool Generation**: Automatically creates MCP tools from any contract ABI at runtime.
*   **Read Functions**: Query contract state (view/pure functions) without sending transactions.
*   **Write Functions**: Execute state-changing transactions with wallet signing support.
*   **Multi-Chain Support**: Works with any EVM-compatible blockchain via configurable RPC endpoints.
*   **Type-Safe Interactions**: Validates function arguments against ABI specifications.

## 📦 Installation

### 🚀 Using npx (Recommended)

To use this server without installing it globally:

```bash
npx @iqai/mcp-abi
```

### 🔧 Build from Source

```bash
git clone https://github.com/IQAIcom/mcp-abi.git
cd mcp-abi
pnpm install
pnpm run build
```

## ⚡ Running with an MCP Client

Add the following configuration to your MCP client settings (e.g., `claude_desktop_config.json`).

### 📋 Minimal Configuration

```json
{
  "mcpServers": {
    "smart-contract-abi": {
      "command": "npx",
      "args": ["-y", "@iqai/mcp-abi"],
      "env": {
        "CONTRACT_ABI": "[{\"inputs\":[{\"name\":\"account\",\"type\":\"address\"}],\"name\":\"balanceOf\",\"outputs\":[{\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"}]",
        "CONTRACT_ADDRESS": "0xaB195B090Cc60C1EFd4d1cEE94Bf441F5931C01b",
        "CONTRACT_NAME": "ERC20"
      }
    }
  }
}
```

### ⚙️ Advanced Configuration (Local Build)

```json
{
  "mcpServers": {
    "smart-contract-abi": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-abi/dist/index.js"],
      "env": {
        "WALLET_PRIVATE_KEY": "your_wallet_private_key_here",
        "CONTRACT_ABI": "[{\"inputs\":[{\"name\":\"to\",\"type\":\"address\"},{\"name\":\"amount\",\"type\":\"uint256\"}],\"name\":\"transfer\",\"outputs\":[{\"type\":\"bool\"}],\"stateMutability\":\"nonpayable\",\"type\":\"function\"}]",
        "CONTRACT_ADDRESS": "0xaB195B090Cc60C1EFd4d1cEE94Bf441F5931C01b",
        "CONTRACT_NAME": "ERC20",
        "CHAIN_ID": "252",
        "RPC_URL": "https://rpc.frax.com"
      }
    }
  }
}
```

## 🔐 Configuration (Environment Variables)

| Variable | Required | Description | Default |
| :--- | :--- | :--- | :--- |
| `CONTRACT_ABI` | Yes | JSON string representation of the contract's ABI | - |
| `CONTRACT_ADDRESS` | Yes | The deployed contract address on the blockchain | - |
| `CONTRACT_NAME` | No | Friendly name for the contract (used as tool name prefix) | `CONTRACT` |
| `WALLET_PRIVATE_KEY` | For writes | Private key for signing transactions (required for write functions) | - |
| `CHAIN_ID` | No | Blockchain network chain ID | `252` (Fraxtal) |
| `RPC_URL` | No | Custom RPC endpoint URL | Default for chain |

## 💡 Usage Examples

### 🔍 Read Contract State
*   "Check the token balance of wallet 0xabc..."
*   "What is the total supply of this token?"
*   "Get the allowance for spender 0x123... from owner 0x456..."

### 📝 Execute Transactions
*   "Transfer 100 tokens to address 0xabc..."
*   "Approve 0x123... to spend 1000 tokens"
*   "Mint a new NFT to wallet 0xdef..."

### 📊 Contract Analysis
*   "What functions are available on this contract?"
*   "Show me all the read functions I can call"
*   "What parameters does the transfer function require?"

## 🛠️ MCP Tools

Tools are dynamically generated based on the provided contract ABI. Each function in the ABI becomes an MCP tool:

*   **Read Functions (view/pure)**: Tools prefixed with contract name (e.g., `erc20_balanceOf`, `erc20_totalSupply`)
*   **Write Functions**: Tools for state-changing operations (e.g., `erc20_transfer`, `erc20_approve`)

Example tool names for an ERC20 contract with `CONTRACT_NAME=ERC20`:
*   `erc20_balanceOf` - Query token balance
*   `erc20_transfer` - Transfer tokens
*   `erc20_approve` - Approve spending
*   `erc20_allowance` - Check allowance

<!-- AUTO-GENERATED TOOLS START -->



<!-- AUTO-GENERATED TOOLS END -->

## 👨‍💻 Development

### 🏗️ Build Project
```bash
pnpm run build
```

### 👁️ Development Mode (Watch)
```bash
pnpm run watch
```

### ✅ Linting & Formatting
```bash
pnpm run lint
pnpm run format
```

### 📁 Project Structure
*   `src/tools/`: Tool generation logic
*   `src/services/`: Contract interaction service
*   `src/lib/`: Shared utilities
*   `src/index.ts`: Server entry point

## 📚 Resources

*   [Model Context Protocol (MCP)](https://modelcontextprotocol.io)
*   [Ethereum ABI Specification](https://docs.soliditylang.org/en/latest/abi-spec.html)
*   [Viem Documentation](https://viem.sh)

## ⚠️ Disclaimer

This tool interacts with blockchain smart contracts and can execute real transactions. Store private keys securely and never commit them to version control. Always test interactions on testnets before mainnet deployment. Trading and interacting with smart contracts involves risk.

## 📄 License

[ISC](LICENSE)
