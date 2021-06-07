import { EMPTY_BYTES32, BIGINT_ZERO } from '../constants'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress, encodeMethodSignature,  encodeBytes32,  encodeAddress,  encodeUint } from '../utils'
import ethSend from '../ethSend'

export default async function withdraw(params) {

	let {
		amount
	} = params;

	return ethSend({
		address: getAddress('TRADING'),
		method: 'withdraw(uint256)',
		data: encodeUint(amount)
	});

}