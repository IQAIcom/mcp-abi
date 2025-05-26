import type { Address, Chain } from "viem";
import { z } from "zod";
import type { ContractService } from "../services/contract.js";
import { InputParserService } from "../services/input-parser.js";
import dedent from "dedent";
import type { FunctionMetadata } from "../types.js";

const generateParamsSchema = z.object({
	pairAddress: z
		.string()
		.startsWith("0x", {
			message:
				"Token contract must be a valid Ethereum address starting with 0x.",
		})
		.describe("The contract address of the agent token to sell."),
	amount: z
		.string()
		.regex(/^\d+(\.\d+)?$/, { message: "Amount must be a valid number." })
		.describe(
			"The amount of base currency (IQ) to spend for buying the agent token.",
		),
	chain: z
		.string()
		.optional()
		.describe("The blockchain network to execute the transaction on."),
});

export const generateTool = {
	name: actionName,
	description: `${func.isReadFunction ? "Query" : "Execute"} the ${func.name} function on ${contractName} contract`,
	parameters: generateParamsSchema,
	execute: async (args: z.infer<typeof generateParamsSchema>) => {
		const walletPrivateKey = process.env.WALLET_PRIVATE_KEY;
		if (!walletPrivateKey) {
			throw new Error(
				"WALLET_PRIVATE_KEY is not set in the environment. This is required to execute trades.",
			);
		}

		console.log(
			`[FRAXLEND_ADD_COLLATERAL] Called with token ${args.pairAddress}, amount: ${args.amount}`,
		);

		try {
			const walletService = new WalletService(
				walletPrivateKey,
				args.chain ? (args.chain as unknown as Chain) : undefined,
			);
			const addCollateralService = new AddCollateralService(walletService);

			const result = await addCollateralService.execute({
				pairAddress: args.pairAddress as Address,
				amount: BigInt(args.amount),
			});

			return `
					✅ Collateral Addition Successful

					🔒 Amount: ${formatWeiToNumber(args.amount)} tokens
					🔗 Transaction: ${result.txHash}

					Collateral has been added to your FraxLend position.
				`;
		} catch (error: unknown) {
			const message =
				error instanceof Error
					? error.message
					: "An unknown error occurred during the transaction.";
			console.log(`[FRAXLEND_ADD_COLLATERAL] Error: ${message}`);
			throw new Error(`Failed to add collateral: ${message}`);
		}
	},
};
