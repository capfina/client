import { getAddress, parseDecimal } from '../../utils'

const createDescription = (products) => {
	if (products.length > 5) {
		return `Register ${products.slice(0, 5).map(symbol).join(' ,')} and ${products.length - 5} more products.`
	} else {
		return `Register ${products.map(symbol).join(' ,')}.`
	}
}

export default function createRegisterProducts(params) {
	const {
		products
	} = params;

	const contract = getAddress('PRODUCTS');
	const method = 'register';
	const value = 0;

	if (products.length > 100) throw new Error('Cannot register more than 100 products.');

	const transactions = [{
		contract,
		method,
		params: [
			{ type: 'bytes32[]', name: 'symbols', value: [] },
			{ type: 'uint256[]', name: 'maxLeverages', value: [] },
			{ type: 'uint256[]', name: 'spreads', value: [] },
			{ type: 'uint256[]', name: 'fundingRates', value: [] }
		],
		value
	}]

	for (let product of products) {
		transactions[0].params[0].value.push(product.symbol);
		transactions[0].params[1].value.push(parseDecimal(product.type == 'crypto' ? '30' : '20', 8n));
		transactions[0].params[2].value.push(parseDecimal('0.001', 8n));
		transactions[0].params[3].value.push(2);
	}

	return {
		description: createDescription(products),
		discoverabilityPeriod: 1,
		transactions,
		expedited: true
	}

}
