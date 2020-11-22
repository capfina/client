import { get } from 'svelte/store'
import { user } from '../stores/main'
import { encodeAddress } from './utils'
import ethCall from './ethCall'

export default function getNonce(address) {

	return ethCall({
		address: address,
		method: 'nonces(address)',
		data: encodeAddress(get(user))
	});

}

