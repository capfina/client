import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function withdraw(params) {

	let {
		amount
	} = params;

	return ethSend({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'withdraw',
			inputs: [
				{ type: 'uint256', value: amount }
			]
		}
	});

}