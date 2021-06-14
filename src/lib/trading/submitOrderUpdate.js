import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function submitOrderUpdate(params) {

	let {
		margin,
		positionId
	} = params;

	return ethSend({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'submitOrderUpdate',
			inputs: [
				{ type: 'uint256', value: positionId },
				{ type: 'uint256', value: margin }
			]
		}
	});

}