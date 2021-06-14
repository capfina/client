import { keccak256 } from 'js-sha3'
import { isDynamicSizeType } from './utils'

function methodSignature(functionAbi) {
	if (!functionAbi.name) throw new Error('invalid function abi name'); 
	return functionAbi.name + '(' + functionAbi.inputs.map(i => i.type) + ')'
}

function encodeMethodSignature(functionAbi) {
	return '0x' + keccak256(methodSignature(functionAbi)).substring(0,8);
}

function padBytes(value) {
	return value.padEnd(value.length + 64 - value.length % 64, 0);
}

export function encodeUint(value) {
	return BigInt(value).toString(16).padStart(64, 0);
}

function encodeBool(value) {
	return encodeUint(value ? 1 : 0);
}

function encodeAddress(address) {
	return address.substring(2).padStart(64,0);
}

function encodeOffset(bytesStrlength) {
	return encodeUint(bytesStrlength / 2);
}

function encodeBytesStrSize(bytesStr) {
	return encodeOffset(bytesStr.length);
}

function encodeBytes(value) {
	return encodeBytesStrSize(value) + padBytes(value);
}

function encodeStringContent(value, maxBytes) {
	const unit8Array = new TextEncoder().encode(value);
	if (maxBytes && unit8Array.length >= maxBytes) throw Error('max bytes: ' + maxBytes);
	return unit8Array.reduce(((acc, num) => acc + num.toString(16)), '');
}

function encodeBytes32(value) {
	if (value.startsWith('0x') && value.length == 66) return value.slice(2);
	return padBytes(encodeStringContent(value, 32));
}

function encodeString(value) {
	const encodedString = encodeStringContent(value);
	return encodeBytesStrSize(encodedString) + padBytes(encodedString);
}

function encodeArrayLength(size) {
	return encodeUint(size);
}

function encodeFixedSizeArray(values, encoder) {
	return [
		encodeArrayLength(values.length),
		...values.map(encoder)
	].join('')
}

function encodeDynamicSizeArray(values, encoder) {
	const encodedValues = values.map(encoder);
	let nextOffset = 64 * values.length;

	const offsets = encodedValues.map(encodedValue => {
		const currentOffset = nextOffset;
		nextOffset += encodedValue.length;
		return encodeOffset(currentOffset);
	});

	return [
		encodeArrayLength(values.length),
		...offsets,
		...encodedValues
	].join('')
}

function encodeParameter(type, data) {
	switch (type) {
		case 'uint8':
		case 'uint':
		case 'uint256': return encodeUint(data);
		case 'bool': return encodeBool(data);
		case 'address': return encodeAddress(data);
		case 'bytes32': return encodeBytes32(data);
		case 'string': return encodeString(data);
		case 'bytes': return encodeBytes(data);
		case 'uint8[]':
		case 'uint[]':
		case 'uint256[]': return encodeFixedSizeArray(data, encodeUint);
		case 'bool[]': return encodeFixedSizeArray(data, encodeBool);
		case 'address[]': return encodeFixedSizeArray(data, encodeAddress);
		case 'bytes32[]': return encodeFixedSizeArray(data, encodeBytes32);
		case 'string[]': return encodeDynamicSizeArray(data, encodeString);
		case 'bytes[]': return encodeDynamicSizeArray(data, encodeBytes);
		default: throw new Error('Abi type not supported: ' + type);
	}
}

export function encodeParameters(inputAbi, dataArray) {
	if (inputAbi.length != dataArray.length) throw new Error('parameter size mismatch');

	let nextOffset = encodeOffset(64 * inputAbi.length);
	let dynamicSizedData = []

	const encodedParameters = inputAbi.map((input, index) => {
		if (isDynamicSizeType(input.type)) {
			// dynamic size type
			const currentOffset = nextOffset;
			const encodedValue = encodeParameter(input.type, dataArray[index]);
			nextOffset += encodeOffset(encodedValue.length);
			// push encoded value to dymamicSizedData
			dynamicSizedData.push(encodedValue);
			// return offset
			return currentOffset;
		}
		// fixed size type
		return encodeParameter(input.type, dataArray[index])
	});

	return [
		'0x',
		...encodedParameters,
		...dynamicSizedData
	].join('')
}

export function encodeMergedParameters(data) {
	return encodeParameters(data, data.map(i => i.value));
}

export function encodeMethodParameters(data) {
	if (!data || !data.type == 'function') throw new Error('invalid function abi'); 
	return encodeMethodSignature(data) + encodeMergedParameters(data.inputs).slice(2);
}
