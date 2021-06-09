<script>
	import Wallet from './Wallet.svelte'
	import { selectedPage } from '../stores/pages'
</script>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 60px;
	}
	.logo {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}
	img {
		height: 25px;
		margin-right: 10px;
	}
</style>

<header>
	<a on:click={() => selectedPage.set('Home')} title='Cap'>
		<div class='logo'>
			<img alt='Cap Logo' src='/assets/logo-pure.svg' />
		</div>
	</a>
	<Wallet/>
</header>
