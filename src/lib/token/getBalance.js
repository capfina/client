import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'

export default function getBalance(address, layer) {

	const _user = get(user);

	if (!_user) return 0n;

	return ethCall({
		address: address || getAddress('DAI', layer),
		data: {
			type: 'function',
			name: 'balanceOf',
			inputs: [
				{ type: 'address', value: _user }
			],
			outputs: [
				{ type: 'uint256', name: 'balance' }
			]
		},
		layer
	})
	.then(r => BigInt(r.balance))
	.catch((e) => {
		console.log('balance err', e);
	});

}
