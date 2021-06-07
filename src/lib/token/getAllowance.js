import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress, encodeAddress } from '../utils'
import ethCall from '../ethCall'

export default function getAllowance(params) {

	const {
		spender,
		address
	} = params;

	const owner = get(user);

	return ethCall({
		address: address,
		method: 'allowance(address,address)',
		data: encodeAddress(owner) + encodeAddress(spender)
	}).then(BigInt);

}
