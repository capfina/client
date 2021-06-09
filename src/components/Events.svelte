<script>
	import Panel from './Panel.svelte'

	import { chainId } from '../stores/main'
	import { events } from '../stores/events'
	import { formatBigInt, parseDecimal, getNetworkConfig } from '../lib/utils'

	let loading = false;
	let showDetails;

	function toggleDetails(txhash) {
		if (showDetails == txhash) {
			showDetails = undefined;
		} else {
			showDetails = txhash;
		}
	}

	function eventString(event) {

		if (event.eventName == 'Order Submitted') {
			return `Submitted${event.positionId != 0 ? ' update to [' + event.positionId + ']...' : ' new order...'} ${event.isBuy ? '⬆' : '⬇'} ${event.symbol} ${event.leverage}×${event.amount}`;
		} else if (event.eventName == 'Position Opened') {
			return `✔ Opened new position ${event.isBuy ? '⬆' : '⬇'} ${event.symbol} ${event.leverage}×${event.amount} @ ${event.price} [${event.positionId}]`;
		} else if (event.eventName == 'Position Closed') {
			return `✔ Closed ${event.amountClosed} @ ${event.price}, got back ${event.amountToReturn} (${event.amountToReturn - event.amountClosed > 0 ? '+' : ''}${(100 * (event.amountToReturn - event.amountClosed)/event.amountClosed).toFixed(2)}%) [${event.positionId}]`;
		} else if (event.eventName == 'Position Margin Added') {
			return `✔ Added margin (${event.newAmount * 1 - event.oldAmount * 1}), now ${event.newLeverage}×${event.newAmount} [${event.positionId}]`;
		} else if (event.eventName == 'Order Cancelled') {
			return `Order cancelled, ${event.reason} [${event.positionId}]`;
		} else if (event.eventName == 'Position Liquidated') {
			return `Liquidated ${event.marginLiquidated} [${event.positionId}]`;
		} else if (event.eventName == 'Liquidation Submitted') {
			return `Submitted liquidation [${event.positionId}]`;
		}

	}

	function explorerURL(chainId, txhash) {
		return getNetworkConfig('EXPLORER_URL') + '/tx/' + txhash;
	}

</script>

<style>
	.row span {
		flex: 1;
	}
	.row a {
		margin-left: 8px;
	}
	.sub-row {
		padding: var(--base-padding);
		border-bottom: 1px solid var(--border-color-light);
	}
	.sub-row :global(input) {
		margin-bottom: var(--base-padding);
	}
	.event-row {
	}
</style>

<Panel title='Events' showToggler={true}>
	{#if !$events || !$events.length}
		<div class='row'>
			Nothing to show.
		</div>
	{:else}
		{#each $events as event}

			<div class='row event-row'>
				<span>
					{eventString(event)}
				</span>
				<a on:click={() => {toggleDetails(event.txhash)}}>Details</a> <a target='_blank' href={explorerURL($chainId, event.txhash)}>TX</a>
			</div>
			{#if showDetails == event.txhash}
			<div class='sub-row'>
				{#each Object.keys(event) as eventKey}
					{eventKey}: {event[eventKey]}<br/>
				{/each}
			</div>
			{/if}

		{/each}
	{/if}
</Panel>