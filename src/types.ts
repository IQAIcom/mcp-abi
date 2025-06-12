import type { Abi, AbiParameter, Chain } from "viem";

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
	inputs: readonly AbiParameter[];
	outputs: readonly AbiParameter[];
	isReadFunction: boolean;
	description?: string;
}
