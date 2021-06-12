import { getNetworkConfig, encodeBytes32 } from '../utils'
import ethSend from '../ethSend'

export default async function redeem(params) {

	console.log('params', params);

	const {
		txId
	} = params;

	return ethSend({
		address: getNetworkConfig('ARB_RETRYABLE_TX_ADDRESS', 2),
		method: 'redeem(bytes32)',
		data: encodeBytes32(txId)
	});

}
