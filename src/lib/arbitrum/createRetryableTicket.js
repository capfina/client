import { getNetworkConfig, encodeAddress, encodeUint } from '../utils'
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
		method: 'createRetryableTicket(address,uint256,uint256,address,address,uint256,uint256,bytes)',
		data: [
			encodeAddress(destAddr),
			encodeUint(l2CallValue),
			encodeUint(maxSubmissionCost),
			encodeAddress(excessFeeRefundAddress),
			encodeAddress(callValueRefundAddress),
			encodeUint(maxGas),
			encodeUint(gasPriceBid),
			encodeUint(8 * 64 / 2 /* offset */) + (data || encodeUint(0))
		].join(''),
		value
	});

}