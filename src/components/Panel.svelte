<script>
	export let title;
	export let loading;
	export let showToggler;

	let collapsed = false;	
	function toggle() {
		collapsed = !collapsed;
	}

</script>

<style>
	.panel {
		background: #eee;
		margin-bottom: var(--base-padding);
		border-radius: 4px;
		overflow: hidden;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0;
		background: #ddd;
		padding: var(--base-padding);
	}
	.header span {
		flex: 1;
	}
	.header a {
		text-decoration: none;
		padding-left: 15px;
	}
	.body {
	}
	.loading {
		pointer-events: none;
		opacity: 0.5;
	}
</style>

<div class={loading ? 'panel loading' : 'panel'}>
	{#if title}
	<div class='header'>
		<span><strong>{title}</strong></span>
		{#if showToggler}<a on:click={toggle}>{#if collapsed}+{:else}—{/if}</a>{/if}
	</div>
	{/if}

	{#if !collapsed}
	<div class='body'>
		<slot></slot>
	</div>
	{/if}
</div>