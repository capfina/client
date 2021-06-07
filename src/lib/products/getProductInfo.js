import ethCall from '../ethCall'
import { getAddress, encodeBytes32, encodeUint, decodeUint } from '../utils'

let cache = {}

export default function getProductInfo(symbol) {
	
	if (cache[symbol]) return Promise.resolve(cache[symbol]);

	return ethCall({
		address: getAddress('PRODUCTS'),
		method: 'getInfo(bytes32,bool)',
		data: encodeBytes32(symbol) + encodeUint(0)
	}).then((result) => {

		let offset = 2 /* 0x */;
		const maxLeverage = decodeUint(result, offset);
		offset += 64;
		const fee = decodeUint(result, offset);
		offset += 64;
		const fundingRate = decodeUint(result, offset);

		const ret = {
			maxLeverage: BigInt(maxLeverage),
			fee: BigInt(fee),
			fundingRate: BigInt(fundingRate)
		};

		cache[symbol] = ret;

		return ret;

	});

}
