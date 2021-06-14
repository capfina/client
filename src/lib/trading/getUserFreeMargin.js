import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'

export default function getUserFreeMargin() {

	const _user = get(user);

	if (!_user) return [];

	return ethCall({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'getUserFreeMargin',
			inputs: [
				{ type: 'address', value: _user }
			],
			outputs: [
				{ type: 'uint256', name: 'freeMargin' }
			]
		}
	})
	.then(r => r.freeMargin)
	.catch((e) => {
		console.log('getUserFreeMargin err', e);
	});

}
