<script>
	import Panel from './Panel.svelte'

	import { chainId } from '../stores/main'
	import { transactions } from '../stores/arbBridgeTransactions'
	import { formatBigInt, getNetworkConfig } from '../lib/utils'


	function txString(transaction) {

		return JSON.stringify(transaction);

	}

	function explorerURL(layer, txhash) {
		return getNetworkConfig('EXPLORER_URL', layer) + '/tx/' + txhash;
	}

</script>

<style>
	.row span {
		flex: 1;
	}
	.row div {
		background: var(--border-color-light);
		padding: 5px;
		font-size: 70%;
		border-radius: 4px;
		white-space: pre;
	}
	.row a {
		margin-left: 8px;
	}
</style>

<Panel title='Bridge Transactions' showToggler={true}>
	{#if !$transactions || !$transactions.length}
		<div class='row'>
			Nothing to show.
		</div>
	{:else}
		{#each $transactions as transaction}

			<div class='row'>
				<span>
					<strong>{transaction.type.startsWith('L1') ? 'L1' : 'L2'}</strong> Transfer {transaction.amount} {transaction.asset}
				</span>
				<div>{transaction.status}</div>
				{#if transaction.status != 'pending'}
					<a target='_blank' href={explorerURL(transaction.type.startsWith('L1') ? 1 : 2, transaction.txid)}>TX</a>
				{/if}
			</div>

		{/each}
	{/if}
</Panel>
