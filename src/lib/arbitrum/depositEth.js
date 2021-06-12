import createRetryableTicket from './createRetryableTicket'
import getSubmissionPrice from './getSubmissionPrice'
import { get } from 'svelte/store'
import { user } from '../../stores/main'

export default async function depositEth(params) {

	const {
		amount
	} = params;

	const _user = get(user);

	const maxSubmissionPrice = await getSubmissionPrice({ dataSize: 0 });

	return createRetryableTicket({
		destAddr: _user,
		l2CallValue: 0,
		maxSubmissionCost: maxSubmissionPrice,
		excessFeeRefundAddress: _user,
		callValueRefundAddress: _user,
		maxGas: 0,
		gasPriceBid: 0,
		value: '0x' + BigInt(amount).toString(16)
	});

}
