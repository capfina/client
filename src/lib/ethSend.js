import { keccak256 } from 'js-sha3'
import { encodeMethodSignature } from './utils'
import { get } from 'svelte/store'
import { user } from '../stores/main'

export default function ethSend(params) {

	const {
		address,
		method,
		data,
		gas
	} = params;

	return ethereum.request({
		method: 'eth_sendTransaction',
		params: [{
			nonce: '0x00', // ignored by MetaMask
			gasPrice: '0x3b9aca00', // customizable by user during MetaMask confirmation. (1gwei gas price)
			gas: gas || '0xf4240', // customizable by user during MetaMask confirmation. (1000000 gas limit)
			to: address, // Required except during contract publications.
			from: get(user), // must match user's active address.
			value: '0x00', // Only required to send ether to the recipient from the initiating external account.
			data: encodeMethodSignature(keccak256(method)) + data,
			chainId: 1 // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
		}]
	});

}
