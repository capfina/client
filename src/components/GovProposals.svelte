<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import Button from './Button.svelte'

	import { proposals, proposalDetails, proposalStates } from '../stores/proposals'
	import { showToast } from '../stores/toasts'

	import castVote from '../lib/governance/castVote'
	import executeProposal from '../lib/governance/executeProposal'
	import { formatBigInt } from '../lib/utils'

	let showCastVote;
	let showExecuteProposal;
	let loadingCastVote = false;
	let loadingExecuteProposal = false;

	function toggleCastVote(id) {
		if (showCastVote == id) {
			showCastVote = undefined;
		} else {
			showCastVote = id;
		}
	}

	async function _castVote(proposalId, support) {

		loadingCastVote = true;

		try {
			const txhash = await castVote({ proposalId, support });
			showToast('Submitted your vote and awaiting confirmation.', 'success');
			toggleCastVote(proposalId);
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		} finally {
			loadingCastVote = false;
		}

	}

	function toggleExecuteProposal(id) {
		if (showExecuteProposal == id) {
			showExecuteProposal = undefined;
		} else {
			showExecuteProposal = id;
		}
	}

	async function _executeProposal(proposalId) {

		loadingExecuteProposal = true;

		try {
			const txhash = await executeProposal({ proposalId });
			showToast('Submitted your proposal execution request.', 'success');
			toggleExecuteProposal(proposalId);
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		} finally {
			loadingExecuteProposal = false;
		}

	}

	function info(proposalInfo, id, key) {
		if (!proposalInfo || !proposalInfo[id]) return '';
		return key ? proposalInfo[id][key] : proposalInfo[id];
	}

</script>

<style>
	.row {
		flex-direction: column;
		align-items: stretch;
	}
	.row > div:not(:first-child) {
		margin-top: var(--base-padding);
	}
	.row span {
		flex: 1;
	}
	.row a {
		margin-left: 8px;
	}
	.two-columns {
		display: flex;
		flex-wrap: wrap;
	}
	.two-columns > * {
		flex: 50%;
		width: 100%;
		padding: 0px 5px;
	}
	.tags {
		display: flex;
		justify-content: space-between;
	}
	.tag-group {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	.tags .tag-group:last-child {
		margin-left: auto;
	}
	.tags a {
		margin: 5px;

	}
	.tags span {
		background: var(--border-color-light);
		margin: 5px;
		padding: 5px;
		font-size: 70%;
		border-radius: 4px;
		white-space: pre;
	}
</style>

<Panel title='Proposals'>
	{#if !$proposals || !$proposals.length}
		<div class='row'>
			No proposals found.
		</div>
	{:else}
		{#each $proposals as proposal}
			<div class='row'>
				<div>
					<span><strong>#{proposal.id}</strong> {info($proposalDetails, proposal.id, 'description')}</span>
				</div>

				<div class='tags'>
					{#if info($proposalStates, proposal.id) != 'Pending'}
						<div class='tag-group'>
							<span><strong>Votes In Favor:</strong> {formatBigInt(proposal.forVotes)}</span><span><strong>Votes Against:</strong> {formatBigInt(proposal.againstVotes)}</span>
						</div>
					{/if}
					<div class='tag-group'>
						{#if info($proposalStates, proposal.id) == 'Active'}
							<a on:click={() => {toggleCastVote(proposal.id)}}>Cast Vote</a>
						{:else if info($proposalStates, proposal.id) == 'Executable'}
							<a on:click={() => {toggleExecuteProposal(proposal.id)}}>Execute Proposal</a>
						{:else}
							<span><strong>{info($proposalStates, proposal.id)}</strong></span>
						{/if}
					</div>
				</div>

				{#if showCastVote == proposal.id}
					<div class='two-columns'>
						<form on:submit|preventDefault={() => {_castVote(proposal.id, false)}}>
							<Button 
								text='Vote Against'
								isloading={loadingCastVote}
							/>
						</form>
						<form on:submit|preventDefault={() => {_castVote(proposal.id, true)}}>
							<Button 
								text='Vote In Favor'
								isloading={loadingCastVote}
							/>
						</form>
					</div>
				{/if}

				{#if showExecuteProposal == proposal.id}
					<div class='two-columns'>
						<form on:submit|preventDefault={() => {_executeProposal(proposal.id)}}>
							<Button 
								text='Execute Proposal'
								isloading={loadingExecuteProposal}
							/>
						</form>
					</div>
				{/if}
			</div>

		{/each}
	{/if}
</Panel>