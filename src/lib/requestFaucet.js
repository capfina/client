import ethSend from './ethSend'
import { getAddress } from './utils'

export default function requestFaucet(address) {

	return ethSend({
		address: address || getAddress('DAI'),
		method: 'faucetRequest()',
		data: ''
	}).then((balance) => {
		if (balance == '0x') return 0n;
		return BigInt(balance);
	});
	
}
