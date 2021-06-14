import ethCall from '../ethCall'

export async function getOutboundCalldataFromGateway(params) {

	const {
		gateway,
		token,
		from,
		to,
		amount,
		data
	} = params;

	const { calldata } = await ethCall({
		address: gateway,
		data: {
			type: 'function',
			name: 'getOutboundCalldata',
			inputs: [
				{ type: 'address', value: token },
				{ type: 'address', value: from },
				{ type: 'address', value: to },
				{ type: 'uint256', value: amount },
				{ type: 'bytes', value: data || '' }
			],
			outputs: [
				{ type: 'bytes', name: 'calldata' }
			]
		},
		layer: 1
	})

	// returns raw bytes without any prefix
	return calldata;

}

export async function counterpartGateway(params) {

	const {
		gateway
	} = params;

	const result = await ethCall({
		address: gateway,
		data: {
			type: 'function',
			name: 'counterpartGateway',
			inputs: [],
			outputs: [
				{ type: 'address', name: 'counterpartGateway' }
			],
		},
		layer: 1
	})

	// returns bytes string with prefix and offset
	return result.counterpartGateway;

}
