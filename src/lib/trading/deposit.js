import { EMPTY_BYTES32, BIGINT_ZERO } from '../constants'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'
import ethSend from '../ethSend'
import sign from '../sign'
import getNonce from '../token/getNonce'
import getName from '../token/getName'
import getAllowance from '../token/getAllowance'
import approve from '../token/approve'

export default async function deposit(params) {

	console.log('params', params);

	const {
		currency,
		amount
	} = params;

	const currencyAddress = getAddress(currency);

	console.log('currencyAddress', currencyAddress);

	const [name, nonce, allowance] = await Promise.all([
		getName(currencyAddress),
		getNonce(currencyAddress),
		getAllowance({
			address: currencyAddress, 
			spender: getAddress('TREASURY')
		})
	]);

	const deadline = Math.ceil(Date.now() / 1000) + 60 * 30;

	let signature = { v: BIGINT_ZERO, r: EMPTY_BYTES32, s: EMPTY_BYTES32 };

	console.log('allowance', allowance, amount, name, nonce);

	// approve if allowance not enough
	if (allowance < 100n * amount) {
		await approve({symbol: 'DAI', spender: getAddress('TREASURY')});
	}

	const { v, r, s } = signature;

	return ethSend({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'deposit',
			inputs: [
				{ type: 'uint256', value: amount },
				{ type: 'uint256', value: deadline },
				{ type: 'uint8', value: v },
				{ type: 'bytes32', value: r },
				{ type: 'bytes32', value: s }
			]
		}
	});

}
