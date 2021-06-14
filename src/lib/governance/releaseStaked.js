import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function stakeAmount(params) {

	console.log('params', params);

	const {
		amount
	} = params;

	return ethSend({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'releaseStaked',
			inputs: [
				{ type: 'uint256', value: amount }
			]
		}
	});

}
