import ethCall from './ethCall'
import { get } from 'svelte/store'
import { user } from '../stores/main'
import { getAddress, encodeAddress, decodeUint, decodeBytes32,decodeAddress } from './utils'

export default function getPositions(address) {

	const _user = get(user);

	if (!_user) return [];

	return ethCall({
		address: getAddress('TRADING'),
		method: 'getUserPositions(address)',
		data: encodeAddress(_user)
	}).then((result) => {
		//console.log('result-pos', result);

		let offset = 2 /* 0x */ + 64 /* offset */;
		const size = parseInt(result.slice(offset, offset + 64), 16);

		offset += 64;

		const results = []
		for (let i=0; i < size; i++) {

			const sender = decodeAddress(result, offset);
			offset += 64;
			const symbol = decodeBytes32(result, offset).replace(/\u0000+$/g, '');
			offset += 64;

			const margin = decodeUint(result, offset);
			offset += 64;
			const leverage = decodeUint(result, offset);
			offset += 64;
			const price = decodeUint(result, offset);
			offset += 64;
			const block = decodeUint(result, offset);
			offset += 64;
			const isBuy = decodeUint(result, offset);
			offset += 64;
			const id = decodeUint(result, offset);
			offset += 64;
			
			results.push({
				id,
				isBuy,
				symbol,
				margin,
				leverage,
				price,
				block,
				sender
			});

		}

 		//results.reverse();
 		results.sort((a, b) => {
 			if (a.id < b.id) {
 				return 1;
 			} else if (a.id > b.id) {
 				return -1;
 			}
 			return 0;
 		});

		//console.log(results);
		return results;

	}).catch((err) => {
		console.log('err-pos', err);
	});

}
