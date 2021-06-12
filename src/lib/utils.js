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

export function encodeMethodSignature(signature) {
	return '0x' + signature.substring(0,8);
}

export function encodeUint(value) {
	return BigInt(value).toString(16).padStart(64, 0);
}

export function encodeBool(value) {
	return encodeUint(value ? 1 : 0);
}

export function encodeAddress(address) {
	return address.substring(2).padStart(64,0);
}

// expects raw bytes without 0x prefix
export function encodeBytesStrSize(bytesStr) {
	return encodeUint(bytesStr.length / 2);
}

export function encodeBytes32(value) {
	//console.log('value',value,value.length);
	const encoded = new TextEncoder().encode(value);
	//console.log('encoded',encoded, encoded.length);
	if (encoded.length > 31) throw Error('bytes32 string must be less than 32 bytes');
	return encoded.reduce(((acc, num) => acc + num.toString(16)), '').padEnd(64, 0);
}

export function decodeUint(bytesStr, offset) {
	const bytesSubstr = bytesStr.slice(offset, offset + 64);
	if (bytesSubstr.length == 0) return null;
	return BigInt('0x' + bytesSubstr);
}

export function decodeBool(bytesStr, offset) {
	return !!decodeUint(bytesStr, offset);
}

export function decodeSize(data, offset) {
	return Number(
		decodeUint(data, offset)
	);
}

export function decodeOffset(data, offset) {
	return Number(
		decodeUint(data, offset) * 2n
	);
}

export function decodeString(bytesStr, offset, length) {
	if (!length) {
		length = decodeOffset(bytesStr, offset);
		offset += 64;
	}
	const bytes = bytesStr.slice(offset);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	return (new TextDecoder().decode(uint8Array).substring(0, length)).replace(/\u0000+$/g, '');
}

export function decodeBytes(bytesStr, offset) {
	const length = decodeOffset(bytesStr, offset);
	offset += 64;
	return bytesStr.slice(offset).substring(0, length);
}

export function decodeAddress(bytesStr, offset) {
	return '0x' + bytesStr.slice(offset + 24, offset + 64);
}

export function decodeFixedSizedArray(bytesStr, offset) {
	// exctract array size
	const size = decodeSize(bytesStr, offset);
	offset += 64;

	// extract array elements
	const result = []
	for (let i=0; i < size; i++) {
		result.push(bytesStr.slice(offset, offset + 64));
		offset += 64;
	}
	return result;
}

export function decodeAddressArray(bytesStr, offset) {
	return decodeFixedSizedArray(bytesStr, offset).map(bytes => decodeAddress(bytes, 0));
}

export function decodeUintArray(bytesStr, offset) {
	return decodeFixedSizedArray(bytesStr, offset).map(bytes => decodeUint(bytes, 0));
}

export function decodeDynamicSizedArray(bytesStr, offset) {
	// exctract array size
	const size = decodeSize(bytesStr, offset);
	offset += 64;
	const begin = offset;

	// extract array elements
	const offsets = []
	for (let i=0; i < size; i++) {
		offsets.push(decodeOffset(bytesStr, offset));
		offset += 64;
	}

	return {begin, offsets};

	return offsets.map(o => decodeString(bytesStr, beginIndex + o));
}

export function decodeStringArray(bytesStr, offset) {
	const { begin, offsets } = decodeDynamicSizedArray(bytesStr, offset);
	return offsets.map(o => decodeString(bytesStr, begin + o));
}

export function decodeBytesArray(bytesStr, offset) {
	const { begin, offsets } = decodeDynamicSizedArray(bytesStr, offset);
	return offsets.map(o => decodeBytes(bytesStr, begin + o));
}

export function decodeBytes32(bytesStr, offset) {
	const bytes = bytesStr.slice(offset, offset + 64);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	if (uint8Array[uint8Array.length - 1] != 0) throw Error('invalid bytes32 string - no null terminator');
	if (uint8Array.length != 32) throw Error('invalid bytes32 - not 32 bytes long');
	return new TextDecoder().decode(uint8Array);
}

export function decodeBytes32Array(bytesStr, offset, size) {
	const result = []
	for (let i=0; i < size; i++) {
		result.push(decodeBytes32(bytesStr, offset));
		offset += 64;
	}
	return result;
}

export function abiDecodeOutput(bytesStr, abiOutput) {
	let index = 0;
	return Object.assign(
		...abiOutput.map((abiItem) => {
			switch(abiItem.type) {
				case 'uint256': return { [abiItem.name]: BigInt(decodeUint(bytesStr, 2 + 64 * index++)) }
				case 'address': return { [abiItem.name]: decodeAddress(bytesStr, 2 + 64 * index++) }
				case 'bool': return { [abiItem.name]: decodeBool(bytesStr, 2 + 64 * index++) }
			} 
		})
	);
}

// expects raw bytes without 0x prefix
export function bytesToUnitArray(bytesStr) {
	return new Uint8Array(bytesStr.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
}
