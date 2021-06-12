<script>

	import { onDestroy } from 'svelte';

	import Header from '../components/Header.svelte'
	import Footer from '../components/Footer.svelte'
	import Toast from '../components/Toast.svelte'

	import ArbBridgeControls from '../components/ArbBridgeControls.svelte'
	import ArbBridgeTxns from '../components/ArbBridgeTxns.svelte'

	import { user } from '../stores/main'
	import { reloadBalance } from '../stores/arbBridge'
	import { updateTransactionInfo } from '../stores/arbBridgeTransactions'

	// data refresher
	const interval = setInterval(() => {
		if (!$user) return;
		reloadBalance.update(n => n + 1);
		updateTransactionInfo();
	}, 3000);

	onDestroy(() => clearInterval(interval));

</script>

<style>
	.container {
		width: 100%;
		max-width: var(--container-width);
		padding: 0 var(--base-padding);
		margin: 0 auto;
	}
</style>

<div class='container'>
	<Header/>
	{#if $user}
		<ArbBridgeControls/>
		<ArbBridgeTxns/>
	{/if}
	<Footer/>
</div>
<Toast/>