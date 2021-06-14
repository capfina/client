import ethCall from '../ethCall'
import { getAddress } from '../utils'

let cache = {}

export default function getProductInfo(symbol) {

	return ethCall({
		address: getAddress('PRODUCTS'),
		data: {
			type: 'function',
			name: 'getInfo',
			inputs: [
				{ type: 'bytes32', value: symbol },
				{ type: 'bool', value: 0 }
			],
			outputs: [
				{ type: 'uint256', name: 'maxLeverage' },
				{ type: 'uint256', name: 'fee' },
				{ type: 'uint256', name: 'fundingRate' }
			]
		}
	});

}
