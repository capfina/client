import { keccak256 } from 'js-sha3'

import {
	getAddress,
	decodeAddress,
	decodeUint,
	decodeBool,
	decodeAddressArray,
	decodeUintArray,
	decodeStringArray,
	decodeBytesArray,
	decodeString,
	decodeOffset
} from '../utils'

import getLogs from '../getLogs'

const EVENTS = [
	'0x' + keccak256('ProposalCreated(uint256,address,address[],uint256[],string[],bytes[],string,bool)')
];

function extractLogData(log) {
	const {
		blockNumber,
		data,
		topics,
		transactionHash
	} = log;

	const eventType = topics[0];

	if (eventType == EVENTS[0]) {
		// order submitted
		const interm = {
			proposer: decodeAddress(data, 2),
			contracts_offset: decodeOffset(data, 2 + 64),
			values_offset: decodeOffset(data, 2 + 64 * 2),
			signatures_offset: decodeOffset(data, 2 + 64 * 3),
			calldatas_offset: decodeOffset(data, 2 + 64 * 4),
			description_offset: decodeOffset(data, 2 + 64 * 5),
			expedited: decodeBool(data, 2 + 64 * 6)
		}

		const raw_data = data.slice(2);

		return {
			proposer: interm.proposer,
			contracts: decodeAddressArray(raw_data, interm.contracts_offset),
			values: decodeUintArray(raw_data, interm.values_offset),
			signatures: decodeStringArray(raw_data, interm.signatures_offset),
			calldatas: decodeBytesArray(raw_data, interm.calldatas_offset),
			description: decodeString(raw_data, interm.description_offset),
			expedited: interm.expedited
		}
	}
	return {};
}

export default async function getProposalDetails(params) {

	const { id, submitBlock } = params;

	const formattedBlockNumber = '0x' + BigInt(submitBlock).toString(16);
	const formattedProposalId = '0x' + BigInt(id).toString(16).padStart(64, 0);

	let logs = await getLogs({
		fromBlock: formattedBlockNumber,
		toBlock: formattedBlockNumber,
		address: getAddress('GOVERNANCE'),
		topics: [EVENTS, formattedProposalId]
	});

	// logs = logs.slice(-1 * LIMIT).map(extractLogData).reverse();
	if (!logs.length) return {};
	return Object.assign({ id }, extractLogData(logs[0]));

}