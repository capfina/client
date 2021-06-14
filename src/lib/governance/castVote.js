import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function castVote(params) {

	console.log('params', params);

	const {
		proposalId,
		support
	} = params;

	return ethSend({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'castVote',
			inputs: [
				{ type: 'uint256', value: proposalId },
				{ type: 'bool', value: support }
			]
		}
	});

}
