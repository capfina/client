import ethCall from '../ethCall'
import { encodeAddress, encodeUint, decodeBytes } from '../utils'

export async function getOutboundCalldataFromGateway(params) {

	const {
		gateway,
		token,
		from,
		to,
		amount,
		data
	} = params;

	const result = await ethCall({
		address: gateway,
		method: 'getOutboundCalldata(address,address,address,uint256,bytes)',
		data: [
			encodeAddress(token),
			encodeAddress(from),
			encodeAddress(to),
			encodeUint(amount),
			encodeUint(5 * 64 / 2 /* offset */) + (data || encodeUint(0))
		].join(''),
		layer: 1
	})

	// returns raw bytes without any prefix
	return decodeBytes(result, 2 + 64);

}

export async function counterpartGateway(params) {

	const {
		gateway
	} = params;

	const result = await ethCall({
		address: gateway,
		method: 'counterpartGateway()',
		data: '',
		layer: 1
	})

	// returns bytes string with prefix and offset
	return result;

}
