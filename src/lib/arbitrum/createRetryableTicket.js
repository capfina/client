import { getNetworkConfig } from '../utils'
import ethSend from '../ethSend'

export default async function createRetryableTicket(params) {

	console.log('params', params);

	const {
		destAddr,
		l2CallValue,
		maxSubmissionCost,
		excessFeeRefundAddress,
		callValueRefundAddress,
		maxGas,
		gasPriceBid,
		data,
		value // used to send ETH
	} = params;

	const inbox = getNetworkConfig('ARBITRUM_INBOX_ADDRESS', 1);

	return ethSend({
		address: inbox,
		data: {
			type: 'function',
			name: 'createRetryableTicket',
			inputs: [
				{ type: 'address', value: destAddr },
				{ type: 'uint256', value: l2CallValue },
				{ type: 'uint256', value: maxSubmissionCost },
				{ type: 'address', value: excessFeeRefundAddress },
				{ type: 'address', value: callValueRefundAddress },
				{ type: 'uint256', value: maxGas },
				{ type: 'uint256', value: gasPriceBid },
				{ type: 'bytes', value: data || '' }
			]
		},
		value
	});

}