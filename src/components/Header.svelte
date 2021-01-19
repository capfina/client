<script>
	import Wallet from './Wallet.svelte'
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
	<div class='logo'>
		<img alt='Cap Logo' src='/assets/logo-pure.svg' />
	</div>
	<Wallet/>
</header>
