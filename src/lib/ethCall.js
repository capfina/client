import { encodeMethodParameters } from './abi/encoders'
import { decodeParameters } from './abi/decoders'
import ethereumRequest from './ethereumRequest'

export default async function ethCall(params) {

	const {
		address,
		data,
		layer
	} = params;

	const requestParams = {
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodParameters(data)
		}, 'latest']
	}

	// console.log('ethCall request:', requestParams);
	const result = await ethereumRequest({ requestParams, layer });

	return decodeParameters(data.outputs, result);

}
