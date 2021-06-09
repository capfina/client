import { getNetworkConfig } from '../utils'
import doFetch from '../doFetch'

export default async function getBlockNumber(params) {

	const url = getNetworkConfig('L1_INFURA_URL');

	const { result } = await doFetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'eth_blockNumber',
			params: []
		})
	})

	// console.log(BigInt(result));

	return BigInt(result);
}
