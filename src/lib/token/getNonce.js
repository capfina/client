import { get } from 'svelte/store'
import { user } from '../../stores/main'
import ethCall from '../ethCall'

export default function getNonce(address) {

	return ethCall({
		address: address,
		data: {
			type: 'function',
			name: 'nonces',
			inputs: [
				{ type: 'address', value: get(user) }
			],
			outputs: [
				{ type: 'uint256', name: 'nonce' }
			]
		}
	})
	.then(r => BigInt(r.nonce));

}

