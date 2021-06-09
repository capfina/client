import ethCall from '../ethCall'
import { getAddress, encodeUint, abiDecodeOutput } from '../utils'

export default async function proposals(params) {

	const {
		proposalId
	} = params;

	const result = await ethCall({
		address: getAddress('GOVERNANCE'),
		method: 'proposals(uint256)',
		data: encodeUint(proposalId)
	})

	const proposal = abiDecodeOutput(result, [
		{name: 'id', type: 'uint256'},
		{name: 'proposer', type: 'address'},
		{name: 'submitBlock', type: 'uint256'},
		{name: 'startBlock', type: 'uint256'},
		{name: 'endBlock', type: 'uint256'},
		{name: 'expirationBlock', type: 'uint256'},
		{name: 'forVotes', type: 'uint256'},
		{name: 'againstVotes', type: 'uint256'},
		{name: 'canceled', type: 'bool'},
		{name: 'executed', type: 'bool'},
		{name: 'expedited', type: 'bool'}
	]);

	return proposal;

}
