let cache = {}

export default function getTransactionReceipt(txhash) {

	if (cache[txhash]) return Promise.resolve(cache[txhash]);

	return ethereum.request({
		method: 'eth_getTransactionReceipt',
		params: [txhash]
	}).then((receipt) => {
		if (receipt) cache[txhash] = receipt;
		return receipt;
	});
	
}


