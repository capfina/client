import ethCall from '../ethCall'
import { getAddress } from '../utils'

export default async function proposals(params) {

	const {
		proposalId
	} = params;

	return await ethCall({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'proposals',
			inputs: [
				{ type: 'uint256', value: proposalId }
			],
			outputs: [
				{ type: 'uint256', name: 'id' },
				{ type: 'address', name: 'proposer' },
				{ type: 'uint256', name: 'submitBlock' },
				{ type: 'uint256', name: 'startBlock' },
				{ type: 'uint256', name: 'endBlock' },
				{ type: 'uint256', name: 'expirationBlock' },
				{ type: 'uint256', name: 'forVotes' },
				{ type: 'uint256', name: 'againstVotes' },
				{ type: 'bool', name: 'canceled' },
				{ type: 'bool', name: 'executed' },
				{ type: 'bool', name: 'expedited' },
			]
		}
	});

}


