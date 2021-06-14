import ethSend from '../ethSend'
import { getAddress } from '../utils'

export default function requestFaucet(params) {

	const {
		asset
	} = params;

	return ethSend({
		address: getAddress(asset || 'DAI'),
		data: {
			type: 'function',
			name: 'faucetRequest',
			inputs: []
		}
	});
	
}
