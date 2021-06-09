import ethCall from '../ethCall'
import { getAddress, encodeUint } from '../utils'

export default async function getVoteThresholds(params) {

	return {
		forVotesThreshold: await ethCall({
			address: getAddress('GOVERNANCE'),
			method: 'forVotesThreshold()',
			data: ''
		}),
		forVotesExpeditedThreshold: await ethCall({
			address: getAddress('GOVERNANCE'),
			method: 'forVotesExpeditedThreshold()',
			data: ''
		})
	}
}
