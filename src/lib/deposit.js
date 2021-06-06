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
import sign from './sign'
import getNonce from './getNonce'
import getName from './getName'
import getAllowance from './getAllowance'
import approveDAI from './approveDAI'

export default async function deposit(params) {

	console.log('params', params);

	const {
		currency,
		amount
	} = params;

	const currencyAddress = getAddress(currency);

	console.log('currencyAddress', currencyAddress);

	const [name, nonce, allowance] = await Promise.all([
		getName(currencyAddress),
		getNonce(currencyAddress),
		getAllowance({
			address: currencyAddress, 
			spender: getAddress('TRADING')
		})
	]);

	const deadline = Math.ceil(Date.now() / 1000) + 60 * 30;

	let signature = { v: BIGINT_ZERO, r: EMPTY_BYTES32, s: EMPTY_BYTES32 };

	console.log('allowance', allowance, amount, name, nonce);

	// approve if allowance not enough
	if (allowance < 100n * amount) {
		approveDAI(getAddress('TRADING'));
	}

	const { v, r, s } = signature;

	return ethSend({
		address: getAddress('TRADING'),
		method: 'deposit(uint256,uint256,uint8,bytes32,bytes32)',
		data: encodeUint(amount) +
			encodeUint(deadline) +
			encodeUint(v) +
			r.slice(2) +
			s.slice(2)
	});

}