import ethereumRequest from './ethereumRequest'

let cache = {}

export default function getTransactionReceipt(txhash, layer) {

	const cache_key = `${txhash}${layer}`
	if (cache[cache_key]) return Promise.resolve(cache[cache_key]);

	const requestParams = {
		method: 'eth_getTransactionReceipt',
		params: [txhash]
	}

	return ethereumRequest({ requestParams, layer }).then((receipt) => {
		if (receipt) cache[cache_key] = receipt;
		return receipt;
	});
	
}


