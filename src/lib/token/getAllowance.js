import { get } from 'svelte/store'
import { user } from '../../stores/main'
import ethCall from '../ethCall'

export default function getAllowance(params) {

	const {
		spender,
		address
	} = params;

	return ethCall({
		address: address,
		data: {
			type: 'function',
			name: 'allowance',
			inputs: [
				{ type: 'address', value: get(user) },
				{ type: 'address', value: spender }
			],
			outputs: [
				{ type: 'uint256', name: 'allowance' }
			]
		}
	})
	.then(r => BigInt(r.allowance));

}
