import { getAddress, encodeUint } from '../utils'
import ethSend from '../ethSend'
import getAllowance from '../token/getAllowance'
import approve from '../token/approve'

export default async function stakeAmount(params) {

	console.log('params', params);

	const {
		amount
	} = params;

	const GOVERNANCE_ADDRESS = getAddress('GOVERNANCE');

	const allowance = await getAllowance({
		address: getAddress('CAP'), 
		spender: GOVERNANCE_ADDRESS
	})

	console.log('allowance', allowance, amount);

	// approve if allowance not enough
	if (allowance < 100n * amount) {
		await approve({symbol: 'CAP', spender: GOVERNANCE_ADDRESS});
	}

	return ethSend({
		address: GOVERNANCE_ADDRESS,
		method: 'stakeToVote(uint256)',
		data: encodeUint(amount)
	});

}
