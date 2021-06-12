import ethSend from '../ethSend'
import { getAddress } from '../utils'

export default function requestFaucet(params) {

	const {
		asset
	} = params;

	return ethSend({
		address: getAddress(asset || 'DAI'),
		method: 'faucetRequest()',
		data: ''
	}).then((balance) => {
		if (balance == '0x') return 0n;
		return BigInt(balance);
	});
	
}
