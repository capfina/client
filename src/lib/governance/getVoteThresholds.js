import ethCall from '../ethCall'
import { getAddress } from '../utils'

export default async function getVoteThresholds(params) {

	return Object.assign(
		await ethCall({
			address: getAddress('GOVERNANCE'),
			data: {
				type: 'function',
				name: 'forVotesThreshold',
				inputs: [],
				outputs: [
					{ type: 'address', name: 'forVotesThreshold' }
				]
			}
		}),
		await ethCall({
			address: getAddress('GOVERNANCE'),
			data: {
				type: 'function',
				name: 'forVotesExpeditedThreshold',
				inputs: [],
				outputs: [
					{ type: 'address', name: 'forVotesExpeditedThreshold' }
				]
			}
		})
	);

}
