import ethCall from './ethCall'
import { get } from 'svelte/store'
import { user } from '../stores/main'
import { getAddress, encodeAddress } from './utils'

export default function getBalance(address) {

	const _user = get(user);

	//console.log('_user', _user);
	
	if (!_user) return 0n;

	//console.log('getBalance', address, _user);

	return ethCall({
		address: address || getAddress('DAI'),
		method: 'balanceOf(address)',
		data: encodeAddress(_user)
	}).then((balance) => {
		//console.log('got balance', balance);
		if (balance == '0x') return 0n;
		return BigInt(balance);
	}).catch((e) => {
		console.log('balance err', e);
	});

}
