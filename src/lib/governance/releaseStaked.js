import { getAddress, encodeUint } from '../utils'
import ethSend from '../ethSend'

export default async function stakeAmount(params) {

	console.log('params', params);

	const {
		amount
	} = params;

	return ethSend({
		address: getAddress('GOVERNANCE'),
		method: 'releaseStaked(uint256)',
		data: encodeUint(amount)
	});

}
