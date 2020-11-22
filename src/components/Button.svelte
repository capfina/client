<script>

	export let onclick;
	export let text;
	export let isloading;

</script>

<style>
	button {
		width: 100%;
		height: 46px;
		font-family: inherit;
		font-size: inherit;
		text-transform: capitalize;
		outline: none;
		border: 1px solid transparent;
		background: #ccc;
		border-radius: 4px;
	}
	button:hover {
		background: #c8c8c8;
	}
	button:active {
		background: #bbb;
		border-color: var(--color-blue);
	}
	button.loading {
		pointer-events: none;
		opacity: 0.5;
	}
</style>

<button type='submit' class={isloading ? 'loading' : ''} on:click={onclick}>{text}</button>