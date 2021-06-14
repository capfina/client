import { getNetworkConfig, getAddress } from '../utils'
import { encodeUint } from '../abi/encoders'
import ethSend from '../ethSend'
import getSubmissionPrice from './getSubmissionPrice'
import { getOutboundCalldataFromGateway, counterpartGateway } from './gatewayHelpers'
import estimateRetryableTicket from './estimateRetryableTicket'
import getGateway from './getGateway'
import getAllowance from '../token/getAllowance'
import approve from '../token/approve'
import { get } from 'svelte/store'
import { user } from '../../stores/main'

export default async function depositERC20(params) {

	console.log('params', params);

	const {
		asset,
		amount,
		data
	} = params;

	const _user = get(user);

	const l1Token = getAddress(asset, 1);
	const l1Gateway = await getGateway({ asset });

	// approve spender
	const allowance = await getAllowance({ address: l1Token, spender: l1Gateway })

	// approve if allowance not enough
	if (allowance < 100n * amount) {
		await approve({symbol: asset, spender: l1Gateway});
	}

	// calculate submission price
	const depositCalldata = await getOutboundCalldataFromGateway({ gateway: l1Gateway, token: l1Token, from: _user, to: _user, amount, data: null });

	const maxSubmissionPriceIncreaseRatio = 13n;
	const maxSubmissionPrice = BigInt(await getSubmissionPrice({ dataSize: depositCalldata.length + 64 * 2 })) * maxSubmissionPriceIncreaseRatio / 10n;

	// calculate max gas
	const l2Dest = await counterpartGateway({ gateway: l1Gateway });

	const maxGas = await estimateRetryableTicket({
		sender: l1Gateway,
		deposit: BigInt(50000000e9),
		destAddr: l2Dest,
		l2CallValue: 0n,
		maxSubmissionCost: maxSubmissionPrice,
		excessFeeRefundAddress: _user,
		callValueRefundAddress: _user,
		maxGas: 0n,
		gasPriceBid: 0n,
		data: depositCalldata
	});

	// calculate required forwarding gas
	const gasPriceBid = BigInt(2e8); // we might want to make this dynamic
    let ethDeposit = maxSubmissionPrice + gasPriceBid * maxGas;

	// prepare request
	const dataContent = [
		encodeUint(maxSubmissionPrice),                         // max submission price
		encodeUint(2 * 64 / 2 /* offset */) + (data || encodeUint(0))
	].join('')

	return ethSend({
		address: getNetworkConfig('ARBITRUM_L1_GATEWAY_ROUTER_ADDRESS', 1),
		data: {
			type: 'function',
			name: 'outboundTransfer',
			inputs: [
				{ type: 'address', value: l1Token },			// erc20L1Address
				{ type: 'address', value: _user },				// destination
				{ type: 'uint256', value: amount },				// amount
				{ type: 'uint256', value: maxGas },				// maxGas
				{ type: 'uint256', value: gasPriceBid },		// gasPriceBid
				{ type: 'bytes', value: dataContent || '' }
			]
		},
		// forwarding gas
		value: '0x' + BigInt(ethDeposit).toString(16)
	});
}
