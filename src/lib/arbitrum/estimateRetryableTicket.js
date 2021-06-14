import { getNetworkConfig, abiDecodeOutput } from '../utils'
import ethCall from '../ethCall'

export default async function estimateRetryableTicket(params) {

	const {
		sender,
		deposit,
		destAddr,
		l2CallValue,
		maxSubmissionCost,
		excessFeeRefundAddress,
		callValueRefundAddress,
		maxGas,
		gasPriceBid,
		data
	} = params;

	const result = await ethCall({
		address: getNetworkConfig('ARB_NODE_INTERFACE_ADDRESS', 2).toUpperCase(),
		data: {
			type: 'function',
			name: 'estimateRetryableTicket',
			inputs: [
				{ type: 'address', value: sender },
				{ type: 'uint256', value: deposit },
				{ type: 'address', value: destAddr },
				{ type: 'uint256', value: l2CallValue },
				{ type: 'uint256', value: maxSubmissionCost },
				{ type: 'address', value: excessFeeRefundAddress },
				{ type: 'address', value: callValueRefundAddress },
				{ type: 'uint256', value: maxGas },
				{ type: 'uint256', value: gasPriceBid },
				{ type: 'bytes', value: data || '' }
			],
			outputs: [
				{ name: 'maxGas', type: 'uint256' },
				{ name: 'nextUpdateTimestamp', type: 'uint256' } // not sure about this name
			]
		},
		layer: 2
	})

	return result.maxGas;

}
