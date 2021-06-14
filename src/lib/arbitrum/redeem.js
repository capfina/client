import { getNetworkConfig } from '../utils'
import ethSend from '../ethSend'

export default async function redeem(params) {

	console.log('params', params);

	const {
		txId
	} = params;

	return ethSend({
		address: getNetworkConfig('ARB_RETRYABLE_TX_ADDRESS', 2),
		data: {
			type: 'function',
			name: 'redeem',
			inputs: [
				{ type: 'bytes32', value: txId }
			]
		}
	});

}
