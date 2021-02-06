<script>

	import { PRODUCT_TO_FIGI } from '../lib/products.js'

	const products_array = Object.keys(PRODUCT_TO_FIGI).sort();
	const products = products_array.join(', ');
</script>

<style>
	footer {
	}
	footer div {
		padding: var(--base-padding) 0;
		border-top: 1px solid var(--border-color);
	}
	footer a {
		color: #00CC29;
	}
	footer .gray {
		color: #999;
		font-size: 80%;
	}
</style>

<footer>
	<div>
		Cap is a decentralized trading protocol that lets you go long or short on stocks, commodities, cryptos, and more using DAI.
		<br/>
		<br/>
		<span class='gray'>Active products ({products_array.length}): {products} (<a href='https://docs.cap.exchange/getting-started/assets-tradables' target='_blank'>more</a>)</span>
	</div>
	
	<div>
		<a href='https://t.me/capfin'>Telegram</a> • <a href='https://github.com/capfina'>Github</a> • <a href='https://cap.exchange/'>Alternative UI</a> • <a href='https://gov.cap.exchange/'>Governance</a>
	</div>
</footer>
