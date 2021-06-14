import ethCall from '../ethCall'
import { getNetworkConfig, getAddress } from '../utils'

export default async function getGateway(params) {

	const {
		asset
	} = params;

	const { gateway } = await ethCall({
		address: getNetworkConfig('ARBITRUM_L1_GATEWAY_ROUTER_ADDRESS', 1),
		data: {
			type: 'function',
			name: 'getGateway',
			inputs: [
				{ type: 'address', value: getAddress(asset, 1) }
			],
			outputs: [
				{ type: 'address', name: 'gateway' }
			],
		},
		layer: 1
	})

	return gateway;

}
