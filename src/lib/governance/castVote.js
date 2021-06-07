import { getAddress, encodeUint, encodeBool } from '../utils'
import ethSend from '../ethSend'

export default async function castVote(params) {

	console.log('params', params);

	const {
		proposalId,
		support
	} = params;

	return ethSend({
		address: getAddress('GOVERNANCE'),
		method: 'castVote(uint256,bool)',
		data: encodeUint(proposalId) + encodeBool(support)
	});

}
