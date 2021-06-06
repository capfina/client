export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);

export const CONTRACTS = {
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
	'0x7a69': {
		DAI: '0x5FbDB2315678afecb367f032d93F642f64180aa3'.toLowerCase(),
		PRODUCTS: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'.toLowerCase(),
		TRADING: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'.toLowerCase(),
		TREASURY: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'.toLowerCase()
	},
	'0x8376940b1db0': { // arbitrum testnet 5
		DAI: '0xf011dd14767Da5506c46b2bC3D1659dB758e0683'.toLowerCase(),
		PRODUCTS: '0x76511C9cC16248E6BaF6EC0D514986d41BE888Ee'.toLowerCase(),
		TRADING: '0x427ABE67aEBBdC1382d97B656cC67c53D91a03e7'.toLowerCase(),
		TREASURY: '0xFb78eeFaE670a001edA2216894eE252b612AF903'.toLowerCase()
	}
};