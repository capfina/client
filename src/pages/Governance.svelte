<script>

	import { onDestroy } from 'svelte';

	import Header from '../components/Header.svelte'
	import Footer from '../components/Footer.svelte'
	import Toast from '../components/Toast.svelte'

	import GovBalance from '../components/GovBalance.svelte'
	import GovProposals from '../components/GovProposals.svelte'

	import { user } from '../stores/main'
	import { reloadBalance } from '../stores/govBalances'
	import { reloadProposals } from '../stores/proposals'

	// data refresher
	const interval = setInterval(() => {
		if (!$user) return;
		reloadBalance.update(n => n + 1);
		reloadProposals.update(n => n + 1);
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
		<GovBalance/>
		<GovProposals/>
	{/if}
	<Footer/>
</div>
<Toast/>