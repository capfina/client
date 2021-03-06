<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import Button from './Button.svelte'

	import { positions } from '../stores/positions'
	import { showToast } from '../stores/toasts'
	import { formatBigInt, parseDecimal } from '../lib/utils'
	import submitOrderUpdate from '../lib/trading/submitOrderUpdate'
	import getProductInfo from '../lib/products/getProductInfo'
	import getBlockNumber from '../lib/layer1/getBlockNumber'
	import { figiToProduct } from '../lib/products'

	let input;
	
	let loadingClose = false;
	let loadingEstimatePnl = false;
	let showClosePosition;
	let showEstimator;
	let estimatedPnl;

	let margin;
	let close_price;

	let closed_cache = {};

	function validateInputs() {
		if (!input) return;
		if (input.validity.patternMismatch || input.validity.valueMissing) return true;
	}

	function toggleClosePosition(id) {
		showEstimator = undefined;
		margin = undefined;
		close_price = undefined;
		estimatedPnl = undefined;
		if (showClosePosition == id) {
			showClosePosition = undefined;
		} else {
			showClosePosition = id;
		}
	}

	function toggleEstimator(id) {
		showClosePosition = undefined;
		margin = undefined;
		close_price = undefined;
		estimatedPnl = undefined;
		if (showEstimator == id) {
			showEstimator = undefined;
		} else {
			showEstimator = id;
		}
	}

	async function closePosition(id, isBuy, amount) {

		console.log('amount', margin);

		if (margin * 1 > amount * 1 || closed_cache[id] && closed_cache[id] + margin * 1 > amount * 1) {
			return showToast('Closing more than position amount.');
		}

		loadingClose = true;
		
		const params = {
			margin: parseDecimal(margin, BigInt(8)),
			positionId: id
		}
		console.log('params FIRST-C', params);
		try {
			const txhash = await submitOrderUpdate(params);
			showToast('Submitted close and awaiting confirmation.', 'success');
			if (!closed_cache[id]) closed_cache[id] = 0;
			closed_cache[id] += margin * 1;
			toggleClosePosition(id);
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		} finally {
			loadingClose = false;
		}

	}

	async function estimatePnl(position) {

		const posAmount = formatBigInt(position.margin, BigInt(8));

		if (margin * 1 > 1 * posAmount) {
			return showToast("Margin to close higher than position's.");
		}

		loadingEstimatePnl = true;

		try {
			console.log('position', position);
			const productInfo = await getProductInfo(position.symbol);

			if (productInfo) {

				console.log('productInfo', productInfo);
				
				let { fee, fundingRate } = productInfo;
				let pnl = 0;

				fee = formatBigInt(fee, BigInt(8), BigInt(8));

				let { isBuy, price, leverage, block } = position;
				leverage = formatBigInt(leverage, BigInt(8), BigInt(4));
				price = formatBigInt(price, BigInt(8), BigInt(8));
				block = parseInt(block);
				let _close_price;
				if (isBuy) {
					_close_price = close_price * (1 - fee * 1);
					pnl = margin * leverage * ((_close_price * 1 - price * 1)/price);
				} else {
					_close_price = close_price * (1 + fee * 1);
					pnl = margin * leverage * ((price * 1 - _close_price * 1)/price);
				}

				// add funding rate, fee
				
				fundingRate = formatBigInt(fundingRate, BigInt(8), BigInt(8));

				const currentBlock = await getBlockNumber();

				let fundingToApply = margin * leverage * Number(currentBlock - BigInt(block)) * fundingRate;

				pnl -= fundingToApply;

				if (pnl <= -1 * margin) {
					estimatedPnl = (-1 * posAmount).toFixed(4) + " DAI (liquidated)";
				} else {
					estimatedPnl = pnl.toFixed(4) + " DAI";
				}

			}

		} catch(e) {
			console.log('product not found', e);
		}

		loadingEstimatePnl = false;

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
	.pd {
		margin-bottom: var(--base-padding);
	}
</style>

<Panel title='Positions'>
	{#if !$positions || !$positions.length}
		<div class='row'>
			Nothing to show.
		</div>
	{:else}
		{#each $positions as position}

			<div class='row'>
				<span>
					{position.isBuy ? '⬆' : '⬇'} {figiToProduct(position.symbol)} {formatBigInt(position.margin, BigInt(8))}(×{formatBigInt(position.leverage, BigInt(8))}) @ {formatBigInt(position.price, BigInt(8))} [{position.id}]
				</span>
				<a on:click={() => {toggleClosePosition(position.id)}}>Close</a> <a on:click={() => {toggleEstimator(position.id)}}>Est</a>
			</div>
			{#if showClosePosition == position.id}
				<div class='sub-row'>
					<form
						on:submit|preventDefault={() => {closePosition(position.id, position.isBuy, formatBigInt(position.margin, BigInt(8), BigInt(8)))}}
						on:invalid={validateInputs}
						on:changed={validateInputs}
						on:input={validateInputs}
					>
						<Input
							bind:element={input}
							placeholder='Margin to close'
							bind:value={margin}
						/>
						<Button 
							text='Close'
							isloading={loadingClose}
						/>
					</form>
				</div>
			{/if}
			{#if showEstimator == position.id}
				<div class='sub-row'>
					<form
						on:submit|preventDefault={() => {estimatePnl(position)}}
						on:invalid={validateInputs}
						on:changed={validateInputs}
						on:input={validateInputs}
					>
						<Input
							bind:element={input}
							placeholder='Margin to close'
							bind:value={margin}
						/>
						<Input
							bind:element={input}
							placeholder='Price to close at'
							bind:value={close_price}
						/>
						{#if estimatedPnl}
						<div class='pd'>
							Estimated P/L: {estimatedPnl} (includes spread and funding)
						</div>
						{/if}
						<Button 
							text='Estimate P/L'
							isloading={loadingEstimatePnl}
						/>
					</form>
				</div>
			{/if}

		{/each}
	{/if}
</Panel>