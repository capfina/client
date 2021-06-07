import ethSend from '../ethSend'
import { getAddress, encodeAddress, encodeUint } from '../utils'

export default async function approve(params) {

	const {
		symbol,
		spender
	} = params

	return ethSend({
		address: getAddress(symbol),
		method: 'approve(address,uint256)',
		data: encodeAddress(spender) + BigInt('0x' + 'F'.repeat(64)).toString()
	}).then((x,e) => {
		console.log('got x', x, e)
	});
	
}