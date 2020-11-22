import ethCall from './ethCall'
import { get } from 'svelte/store'
import { user } from '../stores/main'
import { getAddress, encodeAddress, decodeUint, decodeBytes32,decodeAddress } from './utils'

export default function getUserFreeMargin() {

	const _user = get(user);

	if (!_user) return [];

	return ethCall({
		address: getAddress('TRADING'),
		method: 'getUserFreeMargin(address)',
		data: encodeAddress(_user)
	}).then((freeMargin) => {
		if (freeMargin == '0x') return 0n;
		return BigInt(freeMargin);
	}).catch((e) => {
		console.log('getUserFreeMargin err', e);
	});

}
