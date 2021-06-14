import { keccak256 } from 'js-sha3'

import getLogs from '../getLogs'
import { getAddress } from '../utils'
import { decodeParameters } from '../abi/decoders'

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

		return decodeParameters(
			[
				{ type: 'address', name: 'proposer' },
				{ type: 'address[]', name: 'contracts' },
				{ type: 'uint256[]', name: 'values' },
				{ type: 'string[]', name: 'signatures' },
				{ type: 'bytes[]', name: 'calldatas' },
				{ type: 'string', name: 'description' },
				{ type: 'bool', name: 'expedited' },
			], data
		);

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