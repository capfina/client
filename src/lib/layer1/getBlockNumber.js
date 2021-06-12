import { getNetworkConfig } from '../utils'
import ethereumRequest from '../ethereumRequest'

export default async function getBlockNumber(params) {

	const requestParams = {
		method: 'eth_blockNumber',
		params: []
	}

	const result = await ethereumRequest({ requestParams, layer: 1 });

	return BigInt(result);
}
