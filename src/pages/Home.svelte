<script>

	import Trading from './Trading.svelte'
	import ArbBridge from './ArbBridge.svelte'
	import { chainId } from '../stores/main'

</script>

<style>
</style>

{#if $chainId != '0x2a' && $chainId != '0x4'}
	<Trading/>
{:else}
	<ArbBridge/>
{/if}