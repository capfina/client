import ethCall from '../ethCall'

const cache = {};

export default async function getName(address) {

	if (cache[address]) return Promise.resolve(cache[address]);

	const result = await ethCall({
		address: address,
		data: {
			type: 'function',
			name: 'name',
			inputs: [],
			outputs: [
				{ type: 'string', name: 'name' }
			]
		}
	})
	.then(r => r.name);

	cache[address] = result;
	return result;

}

