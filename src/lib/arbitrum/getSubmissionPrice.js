import { getNetworkConfig } from '../utils'
import ethCall from '../ethCall'

const cache = {};

export default async function getSubmissionPrice(params) {

	console.log('params', params);

	const {
		dataSize
	} = params;

	if (cache[dataSize]) {
		const { price, nextUpdateTimestamp } = cache[dataSize];
		if (Date.now() < nextUpdateTimestamp - 3000) return Promise.resolve(price);
	}

	const { price, nextUpdateTimestamp } = await ethCall({
		address: getNetworkConfig('ARB_RETRYABLE_TX_ADDRESS', 2),
		data: {
			type: 'function',
			name: 'getSubmissionPrice',
			inputs: [
				{ type: 'uint256', value: dataSize }
			],
			outputs: [
				{ type: 'uint256', name: 'price' },
				{ type: 'uint256', name: 'nextUpdateTimestamp' }
			]
		},
		layer: 2
	})

	cache[dataSize] = { price, nextUpdateTimestamp };

	return price;

}
