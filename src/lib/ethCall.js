import { keccak256 } from 'js-sha3'
import { encodeMethodSignature } from './utils'
import ethereumRequest from './ethereumRequest'

export default async function ethCall(params) {

	const {
		address,
		method,
		data,
		layer
	} = params;

	//console.log('ethCall', params, encodeMethodSignature(keccak256(method)) + data);

	const requestParams = {
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(keccak256(method)) + data
		}, 'latest']
	}

	return ethereumRequest({ requestParams, layer });

}
