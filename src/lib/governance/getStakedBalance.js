import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress, encodeAddress } from '../utils'

export default async function getStakedBalance(params) {

	const _user = get(user);

	if (!_user) return 0n;

	return ethCall({
		address: getAddress('GOVERNANCE'),
		method: 'balanceOf(address)',
		data: encodeAddress(_user)
	}).then((balance) => {
		// console.log('got balance', balance);
		if (balance == '0x') return 0n;
		return BigInt(balance);
	}).catch((e) => {
		console.log('balance err', e);
	});

}
