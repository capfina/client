import { EMPTY_BYTES32, BIGINT_ZERO } from './constants'
import { get } from 'svelte/store'
import { user } from '../stores/main'
import {
	getAddress,
	encodeMethodSignature, 
	encodeBytes32, 
	encodeAddress, 
	encodeUint
} from './utils'

import ethSend from './ethSend'

export default async function submitOrder(params) {

	let {
		symbol,
		leverage,
		margin,
		isBuy
	} = params;

	return ethSend({
		address: getAddress('TRADING'),
		method: 'submitOrder(bool,bytes32,uint256,uint256)',
		data: encodeUint(isBuy ? 1 : 0) +
			encodeBytes32(symbol) +
			encodeUint(margin) +
			encodeUint(leverage)
	});

}
