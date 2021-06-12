<script>
	import Panel from './Panel.svelte'
	import Input from './Input.svelte'
	import Button from './Button.svelte'
	import { ethL1Balance, ethL2Balance, daiL1Balance, daiL2Balance, capL1Balance, capL2Balance } from '../stores/arbBridge'
	import { user, chainId } from '../stores/main'
	import { formatBigInt, parseDecimal } from '../lib/utils'
	import { showToast } from '../stores/toasts'
	import { addTransaction } from '../stores/arbBridgeTransactions'

	import depositETH from '../lib/arbitrum/depositETH'
	import depositERC20 from '../lib/arbitrum/depositERC20'
	import requestFaucet from '../lib/token/requestFaucet'

	
	let amountToTransfer;

	let depositType = undefined;

	let input;

	function validateInputs() {
		if (!input) return;
		if (input.validity.patternMismatch || input.validity.valueMissing) return true;
	}

	function toggleTransfer(type) {
		if (depositType == type) {
			// disable
			depositType = undefined
		} else {
			// switch to type
			depositType = type;
		}
	}

	async function _transferETH(amount) {
		try {
			const txid = await depositETH({
				amount: parseDecimal('' + amount)
			});
			console.log(txid);

			addTransaction({ txid, type: 'L1-deposit', asset: 'ETH', amount, status: 'pending', l1ChainId: $chainId, sender: $user });
			amountToTransfer = 0
			depositType = undefined;
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		}
	}

	async function _transferToken(asset, amount) {
		try {
			const txid = await depositERC20({
				asset,
				amount: parseDecimal('' + amount)
			});
			console.log(txid);

			addTransaction({ txid, type: 'L1-deposit', asset, amount, status: 'pending', l1ChainId: $chainId, sender: $user });
			amountToTransfer = 0
			depositType = undefined;
		} catch (e) {
			console.error(e);
			showToast(e && e.message);
		}
	}

	async function _deposit(type) {
		console.log('amountToTransfer', amountToTransfer);
		if (!amountToTransfer) return;

		if (type == 'ETH') {
			_transferETH(amountToTransfer);
		} else {
			_transferToken(type, amountToTransfer);
		}
	}

	async function faucet(asset) {
		try {
			const txhash = await requestFaucet({ asset });
			showToast(`Requested ${asset} from faucet.`, 'success');
		} catch (e) {
			showToast(e && e.message);
		}
	}

</script>

<style>
</style>

<Panel title='L1 Balances'>
	<div class='row'>
		<div class='label'>ETH <a on:click={() => toggleTransfer('ETH')} title='Transfer ETH to Arbitrum Layer 2'>Transfer</a></div>
		<div class='value'>{formatBigInt($ethL1Balance, null, 3n)}</div>
	</div>
	<div class='row'>
		<div class='label'>DAI <a on:click={() => toggleTransfer('DAI')} title='Transfer DAI to Arbitrum Layer 2'>Transfer</a> | <a title='Get 10,000 testnet DAI' on:click={() => faucet('DAI')}>Faucet</a></div>
		<div class='value'>{formatBigInt($daiL1Balance)}</div>
	</div>
	<div class='row'>
		<div class='label'>CAP <a on:click={() => toggleTransfer('CAP')} title='Transfer CAP to Arbitrum Layer 2'>Transfer</a> | <a title='Get 1000 testnet CAP' on:click={() => faucet('CAP')}>Faucet</a></div>
		<div class='value'>{formatBigInt($capL1Balance)}</div>
	</div>
	
	{#if depositType}
		<form
			on:submit|preventDefault={() => _deposit(depositType)}
			on:invalid={validateInputs}
			on:changed={validateInputs}
			on:input={validateInputs}
		>
			<div class='row'>
				<Input
					bind:element={input}
					placeholder='amount to deposit'
					bind:value={amountToTransfer}
				/>
			</div>
			<div class='row'>
				<Button 
					text={'Transfer ' + depositType}
				/>
			</div>
		</form>
	{/if}
</Panel>

<Panel title='L2 Balances'>
	<div class='row'>
		<div class='label'>ETH</div>
		<div class='value'>{formatBigInt($ethL2Balance, null, 3n)}</div>
	</div>
	<div class='row'>
		<div class='label'>DAI</div>
		<div class='value'>{formatBigInt($daiL2Balance)}</div>
	</div>
	<div class='row'>
		<div class='label'>CAP</div>
		<div class='value'>{formatBigInt($capL2Balance)}</div>
	</div>
</Panel>