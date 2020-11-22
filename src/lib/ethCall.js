import { keccak256 } from 'js-sha3'
import { encodeMethodSignature } from './utils'

export default function ethCall(params) {

	const {
		address,
		method,
		data
	} = params;

	//console.log('ethCall', params, encodeMethodSignature(keccak256(method)) + data);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(keccak256(method)) + data
		}, "latest"]
	});

}
