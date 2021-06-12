import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress, encodeAddress } from '../utils'

export default function getBalance(address, layer) {

	const _user = get(user);

	if (!_user) return 0n;

	return ethCall({
		address: address || getAddress('DAI', layer),
		method: 'balanceOf(address)',
		data: encodeAddress(_user),
		layer
	}).then((balance) => {
		//console.log('got balance', balance);
		if (balance == '0x') return 0n;
		return BigInt(balance);
	}).catch((e) => {
		console.log('balance err', e);
	});

}
