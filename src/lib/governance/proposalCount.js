import { getAddress } from '../utils'
import ethCall from '../ethCall'

export default function proposalCount(params) {

	return ethCall({
		address: getAddress('GOVERNANCE'),
		method: 'proposalCount()',
		data: ''
	}).then(BigInt);

}
