export default function proposalState(params) {
	const {
		proposal,
		voteThresholds,
		blockNumber
	} = params;

	const {
		canceled,
		executed,
		expedited,
		startBlock,
		endBlock,
		expirationBlock,
		forVotes,
		againstVotes
	} = proposal;

	const FOR_VOTES_THRESHOLD = BigInt(voteThresholds.forVotesThreshold);
	const FOR_VOTES_EXPEDITED_THRESHOLD = BigInt(voteThresholds.forVotesExpeditedThreshold);

	const response = {id: proposal.id}
	if (canceled) return Object.assign(response, {state: 'Canceled'});
	if (executed) return Object.assign(response, {state: 'Executed'});
	if (blockNumber < startBlock) return Object.assign(response, {state: 'Pending'});
	if (blockNumber <= endBlock) {
		if (expedited && forVotes > againstVotes && forVotes > FOR_VOTES_EXPEDITED_THRESHOLD) return Object.assign(response, {state: 'Executable'});
		return Object.assign(response, {state: 'Active'});
	}
	if (forVotes < againstVotes || forVotes < FOR_VOTES_THRESHOLD) return Object.assign(response, {state: 'Rejected'});
	if (blockNumber < expirationBlock) return Object.assign(response, {state: 'Executable'});
	return Object.assign(response, {state: 'Expired'});
}