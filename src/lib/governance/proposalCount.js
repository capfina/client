import { getAddress } from '../utils'
import ethCall from '../ethCall'

export default async function proposalCount(params) {

	return ethCall({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'proposalCount',
			inputs: [],
			outputs: [
				{ type: 'uint256', name: 'count' }
			]
		}
	}).then(r => BigInt(r.count));

}
