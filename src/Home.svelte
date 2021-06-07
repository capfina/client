<script>

	import Header from './components/Header.svelte'

	import Balance from './components/Balance.svelte'
	import NewOrder from './components/NewOrder.svelte'
	import Positions from './components/Positions.svelte'
	import Events from './components/Events.svelte'
	import Footer from './components/Footer.svelte'
	import Toast from './components/Toast.svelte'
	import Faucet from './components/Faucet.svelte'

	import { user } from './stores/main'
	import { reloadBalance } from './stores/balances'
	import { reloadEvents } from './stores/events'
	import { reloadPositions } from './stores/positions'
	import { chainId } from './stores/main'

	// data refresher
	setInterval(() => {
		if (!$user) return;
		reloadBalance.update(n => n + 1);
		reloadEvents.update(n => n + 1);
		reloadPositions.update(n => n + 1);
	}, 3000);

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
		{#if $chainId != '0x2a'}
			<Balance/>
			<NewOrder/>
			<Positions/>
			<Events/>
		{/if}
		{#if $chainId == '0x2a'}
			<Faucet/>
		{/if}
	{/if}
	<Footer/>
</div>
<Toast/>