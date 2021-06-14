import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'

export default async function getStakedBalance(params) {

	const _user = get(user);

	if (!_user) return 0n;

	return ethCall({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'balanceOf',
			inputs: [
				{ type: 'address', value: _user }
			],
			outputs: [
				{ type: 'uint256', name: 'balance' }
			]
		}
	})
	.then(r => r.balance)
	.catch((e) => {
		console.log('balance err', e);
	});

}
