import { getNetworkConfig, abiDecodeOutput, encodeAddress, encodeUint, encodeBytesStrSize } from '../utils'
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
		method: 'estimateRetryableTicket(address,uint256,address,uint256,uint256,address,address,uint256,uint256,bytes)',
		data: [
			encodeAddress(sender),
			encodeUint(deposit),
			encodeAddress(destAddr),
			encodeUint(l2CallValue),
			encodeUint(maxSubmissionCost),
			encodeAddress(excessFeeRefundAddress),
			encodeAddress(callValueRefundAddress),
			encodeUint(maxGas),
			encodeUint(gasPriceBid),
			encodeUint(10 * 64 / 2 /* offset */) + (data ? encodeBytesStrSize(data) + data : encodeUint(0))
		].join(''),
		layer: 2
	})

	const output = abiDecodeOutput(result, [
		{name: 'maxGas', type: 'uint256'},
		{name: 'nextUpdateTimestamp', type: 'uint256'} // TODO not sure about this name
	]);

	return output.maxGas;

}
