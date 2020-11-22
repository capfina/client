<script>
	import Panel from './Panel.svelte'
	import { baseBalance, reloadBalance, freeMargin } from '../stores/balances'
	import { chainId } from '../stores/main'
	import { asyncTimeout, formatBigInt, parseDecimal } from '../lib/utils'
	import { showToast } from '../stores/toasts'

	import deposit from '../lib/deposit'
	import withdraw from '../lib/withdraw'
	import requestFaucet from '../lib/requestFaucet'

	async function _deposit() {
		try {
			const txhash = await deposit({
				currency: 'DAI',
				amount: parseDecimal('1000', BigInt(8))
			});
			showToast('1000 DAI deposit pending.', 'success');
		} catch (e) {
			console.log(e);
			showToast(e && e.message);
		}
	}

	async function _withdraw() {
		try {
			const txhash = await withdraw({
				currency: 'DAI',
				amount: parseDecimal('100', BigInt(8))
			});
			showToast('100 DAI withdrawal pending.', 'success');
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
		<div class='label'>DAI {#if chainId != '0x1'}(<a title='Get 10000 testnet DAI' on:click={faucet}>faucet</a>) {/if}<a on:click={_deposit} title='Deposit 1000 DAI'>Deposit</a> | <a on:click={_withdraw} title='Withdraw 100 DAI'>Withdraw</a></div>
		<div class='value'>Wallet: {formatBigInt($baseBalance)} | on site: {formatBigInt($freeMargin, BigInt(8))}</div>
	</div>
</Panel>