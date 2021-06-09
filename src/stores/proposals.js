import { writable, derived } from 'svelte/store'
import { user, chainId } from './main'

import getProposals from '../lib/governance/getProposals'
import getProposalDetails from '../lib/governance/getProposalDetails'
import getVoteThresholds from '../lib/governance/getVoteThresholds'
import proposalState from '../lib/governance/proposalState'
import getBlockNumber from '../lib/layer1/getBlockNumber'

export const page = writable(1);

export const reloadProposals = writable(0);
export const loadingProposals = writable(true);
export const loadingProposalDetails = writable(true);
export const loadingProposalStates = writable(true);

export const proposals = derived([chainId, user, page, reloadProposals], async ([$chainId, $user, $page, $reloadProposals], set) => {
	loadingProposals.set(true);
	// console.log('loading proposals');
	if (!$chainId || !$user) {
		set([]);
		loadingProposals.set(false);
		return;
	}
	let _proposals = await getProposals({page: $page, page_size: 10});
	set(_proposals);
	loadingProposals.set(false);
});

export const proposalDetails = derived([proposals], async ([$proposals], set) => {
	loadingProposalDetails.set(true);
	// console.log('loading proposal details');
	if (!$proposals || !$proposals.length) {
		set({});
		loadingProposalDetails.set(false);
		return;
	}

	const _proposalDetails = await Promise.all($proposals.map(p => getProposalDetails(p)));

	const detailsById = _proposalDetails.reduce((acc, curr)=> (acc[curr.id]=curr, acc), {});

	// console.log(detailsById);
	set(detailsById);
	loadingProposalDetails.set(false);
});

export const proposalStates = derived([proposals], async ([$proposals], set) => {
	loadingProposalStates.set(true);
	// console.log('loading proposal states');
	if (!$proposals || !$proposals.length) {
		set({});
		loadingProposalStates.set(false);
		return;
	}

	const voteThresholds = await getVoteThresholds();
	// console.log(voteThresholds);

	const blockNumber = await getBlockNumber();

	const _proposalStates = $proposals.map(proposal => proposalState({proposal, voteThresholds, blockNumber}));

	const _proposalStatesById = _proposalStates.reduce((acc, curr)=> (acc[curr.id]=curr.state, acc), {});

	// console.log(_proposalStatesById);
	set(_proposalStatesById);
	loadingProposalStates.set(false);
});

