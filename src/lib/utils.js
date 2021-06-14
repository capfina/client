import { CONTRACTS, NETWORKS, DEFAULT_DECIMALS, DEFAULT_PRECISION } from './constants'

export function asyncTimeout(duration) {
	return new Promise((resolve) => {
		setTimeout(() => { resolve() }, duration);
	})
}

export function getChainId(layer) {
	if (!window.ethereum || !ethereum.chainId) return null;
	switch (layer) {
		case 1: return NETWORKS[ethereum.chainId].L1_CHAIN_ID || ethereum.chainId;
		case 2: return NETWORKS[ethereum.chainId].L2_CHAIN_ID || ethereum.chainId;
		default: return ethereum.chainId;
	}
}

export function isUsingLayer(layer) {
	if (!window.ethereum || !ethereum.chainId) return null;
	return ethereum.chainId == getChainId(layer);
}

export function getAddress(name, layer) {
	const chainId = getChainId(layer);
	return chainId ? CONTRACTS[chainId][name] : null;
}

export function getNetworkConfig(key, layer) {
	const chainId = getChainId(layer);
	return chainId ? NETWORKS[chainId][key] : null;
}

export function formatUserForEvent(user) {
	return '0x' + user.slice(2).padStart(64, 0);
}

export function formatBigInt(value, decimals, precision) {
	//console.log('fbi', value, decimals, precision, DEFAULT_DECIMALS, DEFAULT_PRECISION);
	if (!value) value = 0n;
	if (!decimals) decimals = DEFAULT_DECIMALS;
	if (!precision) precision = DEFAULT_PRECISION;

	const unit = 10n ** BigInt(decimals);
	const integer = value / unit;
	const fractional = (value % unit);
	if (fractional == 0n) return `${integer}`;

	const precisionUnit = 10n ** (BigInt(decimals) - BigInt(precision));
	const relevantFractional = fractional / precisionUnit;
	const remainderFractional = fractional % precisionUnit;

	let prefix = remainderFractional > 0n ? '' : '';
	return `${prefix}${integer}.${relevantFractional.toString().padStart(Number(precision), 0)}`;
}

export function parseDecimal(value, decimals) {
	if (!decimals) decimals = DEFAULT_DECIMALS;
	const [integer, fractional] = value.split('.');
	const unit = 10n ** decimals;
	return BigInt(integer) * unit + BigInt((fractional || '').padEnd(Number(decimals), 0));
}
