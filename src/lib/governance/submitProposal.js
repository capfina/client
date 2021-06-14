import { encodeParameters } from '../abi/encoders'
import { getAddress } from '../utils'
import ethSend from '../ethSend'

export default async function submitProposal(params) {

	console.log('params', params);

	const {
		description,
		discoverabilityPeriod,
		transactions,
		expedited
	} = params;

	const transactionData = {
		contracts: [],
		values: [],
		signatures: [],
		calldatas: []
	}

	for (let transaction of transactions) {

		const {
			contract,
			method,
			params,
			value
		} = transaction;

		transactionData.contracts.push(contract);
		transactionData.values.push(BigInt(value || '0').toString());
		transactionData.signatures.push(`${method}(${params.map(param => param.type).join(',')})`);
		transactionData.calldatas.push(
			encodeParameters(params.map(param => param.type), params.map(formatParamValue))
		);

	}

	return ethSend({
		address: getAddress('GOVERNANCE'),
		data: {
			type: 'function',
			name: 'submitProposal',
			inputs: [
				{ type: 'uint256', value: discoverabilityPeriod },
				{ type: 'address[]', value: transactionData.contracts },
				{ type: 'uint256[]', value: transactionData.values },
				{ type: 'string[]', value: transactionData.signatures },
				{ type: 'bytes[]', value: transactionData.calldatas },
				{ type: 'string', value: description },
				{ type: 'bool', value: expedited }
			]
		}
	});

}
