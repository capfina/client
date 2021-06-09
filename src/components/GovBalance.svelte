<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import Button from './Button.svelte'
	import { walletBalance, stakedBalance, reloadBalance } from '../stores/govBalances'
	import { chainId } from '../stores/main'
	import { formatBigInt, parseDecimal } from '../lib/utils'
	import { showToast } from '../stores/toasts'

	import stakeAmount from '../lib/governance/stakeAmount'
	import releaseStaked from '../lib/governance/releaseStaked'

	let input;

	let showStake = false;
	let showWithdraw = false;
	let amountToStake;
	let withdrawAmount;

	function validateInputs() {
		if (!input) return;
		if (input.validity.patternMismatch || input.validity.valueMissing) return true;
	}

	function toggleStake() {
		showWithdraw = false;
		showStake = !showStake;
	}
	function toggleWithdraw() {
		showStake = false;
		showWithdraw = !showWithdraw;
	}

	async function _stake() {
		console.log('amountToStake', amountToStake);
		if (!amountToStake) return;
		try {
			const txhash = await stakeAmount({
				amount: parseDecimal("" + amountToStake)
			});
			showToast(amountToStake + ' CAP stake pending.', 'success');
			showStake = false;
		} catch (e) {
			console.log(e);
			showToast(e && e.message);
		}
	}

	async function _withdraw() {
		if (!withdrawAmount) return;
		try {
			const txhash = await releaseStaked({
				amount: parseDecimal("" + withdrawAmount)
			});
			showToast(withdrawAmount + ' CAP withdrawal pending.', 'success');
			showWithdraw = false;
		} catch (e) {
			console.log(e);
			showToast(e && e.message);
		}
	}

</script>

<style>
</style>

<Panel title='Governance Balance'>
	<div class='row'>
		<div class='label'>Staked CAP <a on:click={toggleStake} title='Stake CAP'>Stake</a> | <a on:click={toggleWithdraw} title='Withdraw CAP'>Withdraw</a></div>
		<div class='value'>{formatBigInt($stakedBalance)}</div>
	</div>
	{#if showStake || showWithdraw}
	<div class='row'>
		<div class='label'>CAP in Wallet</div>
		<div class='value'>{formatBigInt($walletBalance)}</div>
	</div>
	{/if}
	{#if showStake}
	<form
		on:submit|preventDefault={_stake}
		on:invalid={validateInputs}
		on:changed={validateInputs}
		on:input={validateInputs}
	>
		<div class='row'>
			<Input
				bind:element={input}
				placeholder='CAP amount to stake'
				bind:value={amountToStake}
			/>
		</div>
		<div class='row'>
			<Button 
				text='Stake'
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
				placeholder='CAP amount to withdraw'
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