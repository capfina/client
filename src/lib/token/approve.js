import ethSend from '../ethSend'
import { getAddress } from '../utils'

export default async function approve(params) {

	const {
		symbol,
		spender
	} = params

	return ethSend({
		address: getAddress(symbol),
		data: {
			type: 'function',
			name: 'approve',
			inputs: [
				{ type: 'address', value: spender },
				{ type: 'uint256', value: BigInt('0x' + 'F'.repeat(64)) }
			]
		}
	}).then((x,e) => {
		console.log('got x', x, e)
	});
	
}