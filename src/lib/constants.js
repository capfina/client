export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);

export const NETWORKS = {
	'0x8376940b1db0': { // arbitrum Kovan testnet
		L1_INFURA_URL: 'https://kovan.infura.io/v3/<INFURA_TOKEN>'
	},
	'0x66eeb': { // arbitrum Rinkeby testnet
		L1_INFURA_URL: 'https://rinkeby.infura.io/v3/<INFURA_TOKEN>'
	}
}

export const CONTRACTS = {
	'0x8376940b1db0': { // arbitrum Kovan testnet
		DAI: '0xf011dd14767Da5506c46b2bC3D1659dB758e0683'.toLowerCase(),
		CAP: '0x26b8c17B21B52B265fC05eC367D621eb02a8726f'.toLowerCase(),
		PRODUCTS: '0x76511C9cC16248E6BaF6EC0D514986d41BE888Ee'.toLowerCase(),
		TRADING: '0x427ABE67aEBBdC1382d97B656cC67c53D91a03e7'.toLowerCase(),
		TREASURY: '0xFb78eeFaE670a001edA2216894eE252b612AF903'.toLowerCase(),
		GOVERNANCE: '0xe9CFBDE58582732c03E191f13A837e23cEdA366C'.toLowerCase()
	},
	'0x2a': { // Kovan Testnet
		DAI: '0x6781b5581a05e7dfb74df32f702125b2eea5faf5'.toLowerCase()
	},
	'0x66eeb': { // arbitrum Rinkeby testnet
		DAI: '0x022733713d0063c656244f03dd391c4b0d48deee'.toLowerCase(),
		CAP: '0xdc687649424dbbfbca6ccedd3a3bc36356a0e6e9'.toLowerCase(),
		PRODUCTS: '0x75e166a94f66c20cEAcaFdc475b818EF82B2e857'.toLowerCase(),
		TRADING: '0x408a6077366295AbED990321502D3EFCb90CF737'.toLowerCase(),
		TREASURY: '0xbbc6c024B8B17A7F82862FeE500D32996D611f0e'.toLowerCase(),
		GOVERNANCE: '0xcD747EA8f410a1aF77727aEBe23eFf5f2586fa34'.toLowerCase()
	},
	'0x4': { // Rinkeby Testnet
		DAI: '0x6aabb7b374f3f0c1f70f9128e1b683acadd97e90'.toLowerCase()
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