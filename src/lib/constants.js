export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);

export const NETWORKS = {
	'0x66eeb': { // arbitrum Rinkeby testnet
		L1_CHAIN_ID: '0x4',
		NETWORK_RPC_URL: 'https://rinkeby.arbitrum.io/rpc',
		EXPLORER_URL: 'https://rinkeby-explorer.arbitrum.io',
		L1_BLOCK_DURATION: 15,
		ARB_RETRYABLE_TX_ADDRESS: '0x000000000000000000000000000000000000006E'.toLowerCase(),
		ARB_NODE_INTERFACE_ADDRESS: '0x00000000000000000000000000000000000000C8'.toLowerCase()
	},
	'0x4': { // Rinkeby Testnet
		L2_CHAIN_ID: '0x66eeb',
		NETWORK_RPC_URL: 'https://rinkeby.infura.io/v3/0bb669b7a5c3417bbf521b6b1c321991',
		EXPLORER_URL: 'https://rinkeby.etherscan.io/',
		ARBITRUM_L1_GATEWAY_ROUTER_ADDRESS: '0x70c143928ecffaf9f5b406f7f4fc28dc43d68380'.toLowerCase(),
		ARBITRUM_INBOX_ADDRESS: '0x578BAde599406A8fE3d24Fd7f7211c0911F5B29e'.toLowerCase(),
	}
}

export const CONTRACTS = {
	'0x66eeb': { // arbitrum Rinkeby testnet
		DAI: '0x775AA86035B8a7224a2ef0B4514Da426af87eb83'.toLowerCase(),
		CAP: '0xc1c74450F16a021007d61927DC3d44a04510eEe5'.toLowerCase(),
		PRODUCTS: '0xf1c3d45EA8cC3A6431325386f18E5747c9B46A62'.toLowerCase(),
		TRADING: '0x6C8bf6688389682312663493403C48651EE5579e'.toLowerCase(),
		TREASURY: '0x4388B26F359df80D07E1235394e8051b190AC179'.toLowerCase(),
		GOVERNANCE: '0x2Ca465694aCad69D9954eA8B399334eAD1815152'.toLowerCase()
	},
	'0x4': { // Rinkeby Testnet
		DAI: '0x68020B5B270e033B10edD07f3532fbA0f656c466'.toLowerCase(),
		CAP: '0xa1EC1B3FBc72ecFd2DAe04c1eB7f2f416aa159b3'.toLowerCase()
	},
	/*
	'0x1': {
		DAI: '0x6b175474e89094c44da98b954eedeac495271d0f'.toLowerCase(),
		PRODUCTS: '0x5777dc3Cc06D55104C63ECDd48CC88908B6ca3d9'.toLowerCase(),
		TRADING: '0x5e4974ca44830f6418c286b4117cf2cee5ce3e47'.toLowerCase(),
		TREASURY: '0x6eB80143761ddfE75D5EA87D913EBc1ebd68DE81'.toLowerCase()
	},
	'0x3': {
		DAI: '0xc29aDA4405024AeD8fF04Ed8600F6F93536DCdC6'.toLowerCase(),
		PRODUCTS: '0x2DDd0ce3aCb5e5F5d6B9D754E733b3eFFb3C1Ab8'.toLowerCase(),
		TRADING: '0x4ecd1C5b4E7b990F7d9bD76fF88cc616fCBdFfd4'.toLowerCase(),
		TREASURY: '0x88F4B165EAB80d3607678d54CF9dA2E1EAE17986'.toLowerCase()
	},
	'0x64': {
	},
	*/
};
