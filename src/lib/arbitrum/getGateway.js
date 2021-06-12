import ethCall from '../ethCall'
import { getNetworkConfig, getAddress, abiDecodeOutput, encodeAddress } from '../utils'

export default async function getGateway(params) {

	const {
		asset
	} = params;

	const result = await ethCall({
		address: getNetworkConfig('ARBITRUM_L1_GATEWAY_ROUTER_ADDRESS', 1),
		method: 'getGateway(address)',
		data: encodeAddress(getAddress(asset, 1)),
		layer: 1
	})

	const { gateway } = abiDecodeOutput(result, [
		{name: 'gateway', type: 'address'}
	]);

	return gateway;

}
