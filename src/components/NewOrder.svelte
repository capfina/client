<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import RadioButton from './RadioButton.svelte'
	import Button from './Button.svelte'

	import { productToFigi } from '../lib/products'
	import getProductInfo from '../lib/getProductInfo'
	import submitOrder from '../lib/submitOrder'
	import { selectedProduct } from '../stores/main'
	import { showToast } from '../stores/toasts'
	import { formatBigInt, parseDecimal } from '../lib/utils'

	let input;
	
	let product;
	let margin;
	let leverage;

	let productInfo;
	let loadingProductInfo = false;
	let productNotFound = false;

	let side = 'buy';
	let loading = false;

	function validateInputs() {
		if (!input) return;
		if (input.validity.patternMismatch || input.validity.valueMissing) return true;
	}

	async function _submitOrder() {
		if (!product || !margin || !leverage) return;

		if (leverage * 1 < 1 || leverage * 1 > 1 * formatBigInt(productInfo.maxLeverage, BigInt(8))) return showToast('!leverage');

		if (margin * 1 < 10) return showToast('!margin');

		loading = true;
		const params = {
			symbol: productToFigi(product.toUpperCase()),
			leverage: parseDecimal(leverage, BigInt(8)),
			margin: parseDecimal(margin, BigInt(8)),
			isBuy: side == 'buy' ? true : false
		}
		console.log('params', params);
		try {
			const txhash = await submitOrder(params);
			showToast('Submitted and awaiting confirmation.', 'success');
			product = undefined;
			margin = undefined;
			leverage = undefined;
		} catch (e) {
			showToast(e && e.message);
		} finally {
			loading = false;
		}
	}

	async function lookupProduct() {
		if (!product) return;
		//console.log('looking up', product);
		try {
			const symbol = productToFigi(product.toUpperCase());
			productInfo = await getProductInfo(symbol);
			//console.log('productInfo', productInfo);
			selectedProduct.set(product);
		} catch(e) {
			productNotFound = true;
			/* 
			// simulate product info
			productInfo = {
				maxLeverage: BigInt(10 * Math.pow(10,18)),
				fee: BigInt(10 * Math.pow(10,15)),
				fundingRate: BigInt(10 * Math.pow(10,13))
			}
			*/
		}
		loadingProductInfo = false;
	}

	let c;
	function productChanged(product) {

		productInfo = undefined;
		
		if (c) clearTimeout(c);
		c = setTimeout(lookupProduct, 1000);
		
		loadingProductInfo = true;
		if (!product) {
			loadingProductInfo = false;
			productNotFound = false;
		}

	}

	$: productChanged(product);

</script>

<style>
	.form-row {
		padding: 0 var(--base-padding);
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-bottom: 1px solid var(--border-color-light);
	}
	.info-row {
		padding: 10px var(--base-padding);
		font-size: 75%;
		border-bottom: 1px solid var(--border-color-light);
	}
	.box {
		padding: var(--base-padding) 0;
	}
	.box.input {
		flex: 1;
	}
	.box.input.pr {
		flex: 2;
	}
	.box.pr {
		padding-right: var(--base-padding);
	}
</style>

<Panel title='New Order'>
	<form
		on:submit|preventDefault={_submitOrder}
		on:invalid={validateInputs}
		on:changed={validateInputs}
		on:input={validateInputs}
	>
		<div class='form-row'>
			<div class='box input'>
				<Input
					_type='text'
					bind:element={input}
					placeholder='BTC, ETH, TSLA, AAPL... or FIGI code'
					uppercase={true}
					bind:value={product}
				/>
			</div>
		</div>
		{#if productInfo}
			<div class='info-row'>
				Found product. Max leverage: {formatBigInt(productInfo.maxLeverage, BigInt(8))}; Spread:  {formatBigInt(BigInt(100) * productInfo.fee, BigInt(8))}%; Daily funding: ~ {formatBigInt(BigInt(5760) * BigInt(100) * productInfo.fundingRate, BigInt(8))}%
			</div>
		{:else}
			{#if loadingProductInfo}
			<div class='info-row'>Searching...</div>
			{:else}
				{#if productNotFound}
				<div class='info-row'>Product not found.</div>
				{/if}
			{/if}
		{/if}

		{#if productInfo}
			<div class='form-row'>
				<div class='box pr'>
					<RadioButton bind:group={side} value='buy' label='Long' />
					<RadioButton bind:group={side} value='sell' label='Short' />
				</div>
				<div class='box input pr'>
					<Input
						bind:element={input}
						placeholder='Margin'
						bind:value={margin}
					/>
				</div>
				<div class='box input'>
					<Input
						bind:element={input}
						placeholder='Leverage'
						bind:value={leverage}
					/>
				</div>
			</div>

			{#if margin && leverage}
			<div class='info-row'>
				Going {side=='buy' ? 'long' : 'short'} {parseInt(margin*leverage).toLocaleString()} DAI ({parseInt(margin).toLocaleString()} x {leverage}) on {product.toUpperCase()}.
			</div>
			{/if}

			<div class='row'>
				<Button 
					text='Submit Order'
					isloading={loading}
				/>
			</div>
			
		{/if}

	</form>
</Panel>