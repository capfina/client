<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import Button from './Button.svelte'
	import { baseBalance, reloadBalance, freeMargin } from '../stores/balances'
	import { chainId } from '../stores/main'
	import { asyncTimeout, formatBigInt, parseDecimal } from '../lib/utils'
	import { showToast } from '../stores/toasts'

	import deposit from '../lib/deposit'
	import withdraw from '../lib/withdraw'
	import requestFaucet from '../lib/requestFaucet'

	let input;

	let showDeposit = false;
	let showWithdraw = false;
	let depositAmount;
	let withdrawAmount;

	function validateInputs() {
		if (!input) return;
		if (input.validity.patternMismatch || input.validity.valueMissing) return true;
	}

	function toggleDeposit() {
		showWithdraw = false;
		showDeposit = !showDeposit;
	}
	function toggleWithdraw() {
		showDeposit = false;
		showWithdraw = !showWithdraw;
	}

	async function _deposit() {
		console.log('depositAmount', depositAmount);
		if (!depositAmount) return;
		try {
			const txhash = await deposit({
				currency: 'DAI',
				amount: parseDecimal("" + depositAmount, BigInt(8))
			});
			showToast(depositAmount + ' DAI deposit pending.', 'success');
			showDeposit = false;
		} catch (e) {
			console.log(e);
			showToast(e && e.message);
		}
	}

	async function _withdraw() {
		if (!withdrawAmount) return;
		try {
			const txhash = await withdraw({
				currency: 'DAI',
				amount: parseDecimal("" + withdrawAmount, BigInt(8))
			});
			showToast(withdrawAmount + ' DAI withdrawal pending.', 'success');
			showWithdraw = false;
		} catch (e) {
			console.log(e);
			showToast(e && e.message);
		}
	}

	async function faucet() {
		try {
			const txhash = await requestFaucet();
			showToast('Requested DAI from faucet.', 'success');
		} catch (e) {
			showToast(e && e.message);
		}
	}

</script>

<style>
</style>

<Panel title='Balance'>
	<div class='row'>
		<div class='label'>DAI <a on:click={toggleDeposit} title='Deposit DAI'>Deposit</a> | <a on:click={toggleWithdraw} title='Withdraw DAI'>Withdraw</a></div>
		<div class='value'>{formatBigInt($freeMargin, BigInt(8))}</div>
	</div>
	{#if showDeposit || showWithdraw}
	<div class='row'>
		<div class='label'>Wallet DAI {#if chainId != '0x1'}(<a title='Get 10,000 testnet DAI' on:click={faucet}>faucet</a>){/if}</div>
		<div class='value'>{formatBigInt($baseBalance)}</div>
	</div>
	{/if}
	{#if showDeposit}
	<form
		on:submit|preventDefault={_deposit}
		on:invalid={validateInputs}
		on:changed={validateInputs}
		on:input={validateInputs}
	>
		<div class='row'>
			<Input
				bind:element={input}
				placeholder='DAI amount to deposit'
				bind:value={depositAmount}
			/>
		</div>
		<div class='row'>
			<Button 
				text='Deposit'
			/>
		</div>
	</form>
	{/if}
	{#if showWithdraw}
	<form
		on:submit|preventDefault={_withdraw}
		on:invalid={validateInputs}
		on:changed={validateInputs}
		on:input={validateInputs}
	>
		<div class='row'>
			<Input
				bind:element={input}
				placeholder='DAI amount to withdraw'
				bind:value={withdrawAmount}
			/>
		</div>
		<div class='row'>
			<Button 
				text='Withdraw'
			/>
		</div>
	</form>
	{/if}
</Panel>