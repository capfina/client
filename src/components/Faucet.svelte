<script>
	import Panel from './Panel.svelte'
	import { baseBalance } from '../stores/balances'
	import { formatBigInt } from '../lib/utils'
	import { showToast } from '../stores/toasts'

	import requestFaucet from '../lib/token/requestFaucet'

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

<Panel title='DAI Faucet'>
	<div class='row'>
		<div class='label'>Wallet DAI (<a title='Get 10,000 testnet DAI' on:click={faucet}>faucet</a>)</div>
		<div class='value'>{formatBigInt($baseBalance || 0)}</div>
	</div>
</Panel>