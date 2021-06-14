import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function executeProposal(params) {

	console.log('params', params);

	const {
		proposalId
	} = params;

	return ethSend({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'executeProposal',
			inputs: [
				{ type: 'uint256', value: proposalId }
			]
		},
		gas: '0x989680'
	});

}
