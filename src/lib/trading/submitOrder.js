import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function submitOrder(params) {

	let {
		symbol,
		leverage,
		margin,
		isBuy
	} = params;

	return ethSend({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'submitOrder',
			inputs: [
				{ type: 'bool', value: isBuy },
				{ type: 'bytes32', value: symbol },
				{ type: 'uint256', value: margin },
				{ type: 'uint256', value: leverage }
			]
		}
	});

}
