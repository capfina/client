import { get } from 'svelte/store'
import { user } from '../stores/main'
import { encodeAddress } from './utils'
import ethereumRequest from './ethereumRequest'

export default function getBalance(params) {

	const {
		layer
	} = params;

	const _user = get(user);
	if (!_user) return 0n;

	const requestParams = {
		method: 'eth_getBalance',
		params: [
			_user,
			'latest'
		]
	}

	return ethereumRequest({ requestParams, layer }).then((balance) => {
		//console.log('got balance', balance);
		if (balance == '0x') return 0n;
		return BigInt(balance);
	}).catch((e) => {
		console.log('balance err', e);
	});

}

