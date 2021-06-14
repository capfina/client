import { keccak256 } from 'js-sha3'
import { getChainId } from '../utils'
import { encodeUint } from '../abi/encoders'

const LEFTMOST_BIT = BigInt('0x8000000000000000000000000000000000000000000000000000000000000000');

// expects raw bytes without 0x prefix
function bytesToUnitArray(bytesStr) {
	return new Uint8Array(bytesStr.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
}

export function calculateL2TransactionHash(seqNum) {
	const encodedChainId = encodeUint(getChainId(2));
	const encodedSeqNum = encodeUint(BigInt(seqNum) | LEFTMOST_BIT);
	return '0x' + keccak256(bytesToUnitArray(encodedChainId + encodedSeqNum));
}

export function calculateL2RetryableTransactionHash(seqNum) {
	const requestID = calculateL2TransactionHash(seqNum)
	return '0x' + keccak256(bytesToUnitArray(encodeUint(requestID).slice(2) + encodeUint(0)));
}
