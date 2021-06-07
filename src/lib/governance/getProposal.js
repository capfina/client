import ethCall from '../ethCall'
import { getAddress, encodeUint, abiDecodeOutput } from '../utils'

export default function proposals(params) {

	const {
		proposal_id
	} = params;

	return ethCall({
		address: getAddress('GOVERNANCE'),
		method: 'proposals(uint256)',
		data: encodeUint(proposal_id)
	}).then((result) => {
		return abiDecodeOutput(result, [
			{name: 'id', type: 'uint256'},
			{name: 'proposer', type: 'address'},
			{name: 'startBlock', type: 'uint256'},
			{name: 'endBlock', type: 'uint256'},
			{name: 'expirationBlock', type: 'uint256'},
			{name: 'forVotes', type: 'uint256'},
			{name: 'againstVotes', type: 'uint256'},
			{name: 'canceled', type: 'bool'},
			{name: 'executed', type: 'bool'},
			{name: 'expedited', type: 'bool'}
		]);
	});

}
