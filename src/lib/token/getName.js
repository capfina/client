import ethCall from '../ethCall'
import { decodeString } from '../utils'

const cache = {};

export default function getName(address) {

	if (cache[address]) return Promise.resolve(cache[address]);

	return ethCall({
		address: address,
		method: 'name()',
		data: ''
	}).then((result) => {
		const offset = 2 /* 0x */ + 64 /* offset */;
		const length = parseInt(result.slice(offset, offset + 64), 16);
		const string_value = decodeString(result, offset + 64, length);

		// cache
		cache[address] = string_value;
		return string_value;
	});

}

