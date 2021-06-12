import { encodeUint, getNetworkConfig, abiDecodeOutput } from '../utils'
import ethCall from '../ethCall'

export default async function getSubmissionPrice(params) {

	// TODO cache until nextUpdateTimestamp
	console.log('params', params);

	const {
		dataSize
	} = params;

	const result = await ethCall({
		address: getNetworkConfig('ARB_RETRYABLE_TX_ADDRESS', 2),
		method: 'getSubmissionPrice(uint256)',
		data: encodeUint(dataSize),
		layer: 2
	})

	const {price, nextUpdateTimestamp} = abiDecodeOutput(result, [
		{name: 'price', type: 'uint256'},
		{name: 'nextUpdateTimestamp', type: 'uint256'}
	]);

	return price;

}
