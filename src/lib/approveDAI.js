import ethSend from './ethSend'
import { getAddress, encodeAddress, encodeUint } from './utils'

export default function approveDAI() {

	const data = encodeAddress(getAddress('TREASURY')) + BigInt('0x' + 'F'.repeat(64)).toString();

	return ethSend({
		address: getAddress('DAI'),
		method: 'approve(address,uint256)',
		data
	}).then((x,e) => {
		console.log('got x', x, e)
	});
	
}