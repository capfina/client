<script>
	import Home from './Home.svelte';
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
	:global(html.loading) {
		cursor: progress !important;
	}
	:global(html.loading body) {
	}
	:global(body) {
		background: var(--bg-color);
		font-size: 16.5px;
		font-family: 'Roboto', serif;
	}
	:global(:root) {
		--color-main: red;
		--base-padding: 18px;
		--color-green: #00CF29;
		--color-blue: #0000EE;
		--border-color: #c8c8c8;
		--border-color-light: #ddd;
		--bg-color: #fff;
		--container-width: 660px;
	}
	:global(a) {
		color: var(--color-blue);
		text-decoration: underline;
		cursor: pointer;
	}
	:global(.clickable) {
		cursor: pointer !important;
	}
	/* example: add class dark to body to update theme */
	:global(.dark) {
		--color-main: blue;
	}
	:global(.row) {
		padding: var(--base-padding);
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid var(--border-color-light);
	}
	:global(.row:last-child) {
		border-bottom: none;
	}
</style>

<main>
	<Home />
</main>