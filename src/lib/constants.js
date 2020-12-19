export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);

export const CONTRACTS = {
	'0x1': {
	},
	'0x3': {
		DAI: '0xd90Dc99200F38fdF5F42Ce753839DdBFf93bb550'.toLowerCase(),
		PRODUCTS: '0x9BA6F4bE7ea9C769C5f81c7559062eB062fbe94C'.toLowerCase(),
		TRADING: '0x101c05ecfb8fcdF75d13E72fbA0db651e1709c6d'.toLowerCase(),
		TREASURY: '0xDc240537E16acdaCCC1AdC7c60D6D3689113Ab1A'.toLowerCase()
	},
	'0x64': {
	},
	'0x7a69': {
		DAI: '0x5FbDB2315678afecb367f032d93F642f64180aa3'.toLowerCase(),
		PRODUCTS: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'.toLowerCase(),
		TRADING: '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e'.toLowerCase(),
		TREASURY: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'.toLowerCase()
	}
};