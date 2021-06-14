import { isDynamicSizeType } from './utils'

function decodeUint(bytesStr, offset) {
	const bytesSubstr = bytesStr.slice(offset, offset + 64);
	if (bytesSubstr.length == 0) return null;
	return BigInt('0x' + bytesSubstr);
}

function decodeBool(bytesStr, offset) {
	return !!decodeUint(bytesStr, offset);
}

function decodeAddress(bytesStr, offset) {
	return '0x' + bytesStr.slice(offset + 24, offset + 64);
}

function decodeOffset(bytesStr, offset) {
	return Number(
		decodeUint(bytesStr, offset) * 2n
	);
}

function decodeBytes(bytesStr, offset) {
	const length = decodeOffset(bytesStr, offset);
	return bytesStr.slice(offset + 64).substring(0, length);
}

function decodeBytes32(bytesStr, offset) {
	const bytes = bytesStr.slice(offset, offset + 64);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	if (uint8Array[uint8Array.length - 1] != 0) throw Error('invalid bytes32 string - no null terminator');
	if (uint8Array.length != 32) throw Error('invalid bytes32 - not 32 bytes long');
	return (new TextDecoder().decode(uint8Array)).replace(/\u0000+$/g, '');
}

function decodeString(bytesStr, offset) {
	const length = decodeOffset(bytesStr, offset);
	const bytes = bytesStr.slice(offset + 64);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	return (new TextDecoder().decode(uint8Array).substring(0, length)).replace(/\u0000+$/g, '');
}

function decodeArrayLength(bytesStr, offset) {
	return Number(
		decodeUint(bytesStr, offset)
	);
}

function decodeFixedSizeArray(bytesStr, offset, decoder) {
	const length = decodeArrayLength(bytesStr, offset);
	return Array.from(new Array(length)).map((_, i) => decoder(bytesStr, offset + 64 * (i + 1)));
}

function decodeDynamicSizeArray(bytesStr, offset, decoder, decoderAbi /* only used for tuples */) {
	const length = decodeArrayLength(bytesStr, offset);
	// return Array.from(new Array(length)).map((_, i) => {
	return Array.from(new Array(length)).map((_, i) => {
		if (decoderAbi) {
			// used internal abi for tuples
			return decoder(decoderAbi, bytesStr, offset + 64 + 64 * decoderAbi.length * i);
		}
		const itemOffset = decodeOffset(bytesStr, offset + 64 * (i + 1));
		return decoder(bytesStr, 64 + offset + itemOffset);
	});
}

export function decodeParameter(paramAbi, bytesStr, offset) {
	switch (paramAbi.type) {
		case 'uint8':
		case 'uint':
		case 'uint256': return decodeUint(bytesStr, offset);
		case 'bool': return decodeBool(bytesStr, offset);
		case 'address': return decodeAddress(bytesStr, offset);
		case 'bytes32': return decodeBytes32(bytesStr, offset);
		case 'string': return decodeString(bytesStr, offset);
		case 'bytes': return decodeBytes(bytesStr, offset);
		case 'uint8[]':
		case 'uint[]':
		case 'uint256[]': return decodeFixedSizeArray(bytesStr, offset, decodeUint);
		case 'bool[]': return decodeFixedSizeArray(bytesStr, offset, decodeBool);
		case 'address[]': return decodeFixedSizeArray(bytesStr, offset, decodeAddress);
		case 'bytes32[]': return decodeFixedSizeArray(bytesStr, offset, decodeBytes32);
		case 'string[]': return decodeDynamicSizeArray(bytesStr, offset, decodeString);
		case 'bytes[]': return decodeDynamicSizeArray(bytesStr, offset, decodeBytes);
		case 'tuples[]': return decodeDynamicSizeArray(bytesStr, offset, decodeParameters, paramAbi.components);
		default: throw new Error('Abi type not supported: ' + paramAbi.type);
	}
}

export function decodeParameters(outputAbi, bytesStr, offset) {
	return Object.assign(
		...outputAbi.map((abiItem, index) => {
			const format = abiItem.format || (echo => echo); 
			if (isDynamicSizeType(abiItem.type)) {
				const itemOffset = decodeOffset(bytesStr, (offset || 2) + 64 * index);
				return { [abiItem.name]: format(decodeParameter(abiItem, bytesStr, (offset || 2) + itemOffset)) }
			}
			return { [abiItem.name]: format(decodeParameter(abiItem, bytesStr, (offset || 2) + 64 * index)) }
		})
	);
}
