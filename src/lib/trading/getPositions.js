import ethCall from '../ethCall'
import { get } from 'svelte/store'
import { user } from '../../stores/main'
import { getAddress } from '../utils'

export default function getPositions(address) {

	const _user = get(user);

	if (!_user) return [];

	return ethCall({
		address: getAddress('TRADING'),
		data: {
			type: 'function',
			name: 'getUserPositions',
			inputs: [
				{ type: 'address', value: _user }
			],
			outputs: [
				{
					components: [
						{ type: 'address', name: 'sender' },
						{ type: 'bytes32', name: 'symbol' },
						{ type: 'uint256', name: 'margin' },
						{ type: 'uint256', name: 'leverage' },
						{ type: 'uint256', name: 'price' },
						{ type: 'uint256', name: 'block' },
						{ type: 'bool', name: 'isBuy' },
						{ type: 'uint256', name: 'id' }
					],
					type: 'tuples[]',
					name: 'positions'
				}
			]
		}
	})
	.then((result) => {

		const { positions } = result;
 		positions.sort((a, b) => {
 			if (a.id < b.id) {
 				return 1;
 			} else if (a.id > b.id) {
 				return -1;
 			}
 			return 0;
 		});

		return positions;

	})
	.catch((err) => {
		console.log('err-pos', err);
	});

}
