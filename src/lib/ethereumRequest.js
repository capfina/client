import { keccak256 } from 'js-sha3'
import { getNetworkConfig, isUsingLayer } from './utils'
import doFetch from './doFetch'

let reqId = 1;

export default async function ethCall(params) {

	const {
		requestParams,
		layer
	} = params;


	if (layer && !isUsingLayer(layer)) {
		// use http directly
		const httpUrl = getNetworkConfig('NETWORK_RPC_URL', layer);

		const { result, id } = await doFetch(httpUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Object.assign({ jsonrpc: '2.0', id: reqId++ }, requestParams))
		});

		return result;
	}

	// metamask provider
	return ethereum.request(requestParams);

}
