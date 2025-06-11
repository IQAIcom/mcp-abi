import type { Context } from "fastmcp";
import type { Abi, Chain } from "viem";

export interface AbiPluginOptions {
	abi?: Abi;
	contractName?: string;
	contractAddress?: `0x${string}`;
	description?: string;
	privateKey?: string;
	chain?: Chain;
}

export interface FunctionMetadata {
	name: string;
	stateMutability: string;
	inputs: unknown[];
	outputs: unknown[];
	isReadFunction: boolean;
}

export interface Tools {
	name: string;
	description: string;
	execute: (args: unknown, context: Context<undefined>) => Promise<string>;
}
