<script>

	import { onMount } from 'svelte';
	import { user, chainId } from '../stores/main'
	import { showToast } from '../stores/toasts'

	let isMetamask;

	function checkChainId(chainId) {
		if (!chainId) return true;
		// arbitrum testnet and mainnet
		if (chainId == '0x66eeb' || chainId == '0xa4b1' || chainId == '0x4') return true;
		showToast('Cap only works on Arbitrum. Please switch to Arbitrum Rinkeby testnet or Arbitrum mainnet and reload the page.');
		return false;
	}

	function initProvider() {

		isMetamask = window.ethereum && window.ethereum.isMetaMask;

		if (!isMetamask) {
			showToast('Please install Metamask to use Cap.');
			return;
		};

	    /**********************************************************/
	    /* Handle chain (network) and chainChanged (per EIP-1193) */
	    /**********************************************************/

	    // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
	    // returns incorrectly formatted chain ID values.
	    let currentChainId = ethereum.chainId;
	    //console.log('currentChainId', currentChainId);
	    if (!currentChainId) {
	    	// interval set
	    	const c = setInterval(() => {
	    		if (currentChainId) {
	    			chainId.set(currentChainId);
	    			checkChainId(currentChainId);
	    			clearInterval(c);
	    		}
	    		currentChainId = ethereum.chainId;
	    	}, 500);
	    }
	    chainId.set(currentChainId);
	    checkChainId(currentChainId);

	    ethereum.on('chainChanged', (_chainId) => {
	    	//console.log('_chainId', _chainId);
	    	chainId.set(_chainId);
	    	checkChainId(_chainId);
	    });

	    /***********************************************************/
	    /* Handle user accounts and accountsChanged (per EIP-1193) */
	    /***********************************************************/

	    let currentAccount = null;
	    ethereum
	    .request({ method: 'eth_accounts' })
	    .then(handleAccountsChanged)
	    .catch((err) => {
	        // Some unexpected error.
	        // For backwards compatibility reasons, if no accounts are available,
	        // eth_accounts will return an empty array.
	        console.error(err);
	    });

	    // Note that this event is emitted on page load.
	    // If the array of accounts is non-empty, you're already
	    // connected.
	    ethereum.on('accountsChanged', handleAccountsChanged);

	    ethereum.on('connect', () => {
	    	// You can now submit RPC requests
		})

		ethereum.on('disconnect', () => {
			// Disconnected from network, must reload the page to reconnect
			window.location.reload(); // reloads stores etc.
		});

	}

	function handleMetamaskDisconnected() {
		localStorage.clear();
		window.location.reload(false);
	}

	// For now, 'eth_accounts' will continue to always return an array
	function handleAccountsChanged(accounts) {
		// console.log('handleAccountsChanged', accounts);
    	if (accounts.length === 0) {
    		if ($user) {
    			user.set(null);
    			handleMetamaskDisconnected();
    		}
    	} else if (accounts[0] !== $user) {
    		user.set(accounts[0]);
    	}
	}

	// Called on button click
	function connect() {
		if (!isMetamask) {
			showToast('Please install Metamask to use Cap.');
			return;
		};
	  	ethereum
	  	.request({ method: 'eth_requestAccounts' })
	  	.then(handleAccountsChanged)
	  	.catch((err) => {
	  		if (error.code === 4001) {
	  			// Request rejected by the user
	  			// EIP-1193 userRejectedRequest error
	  			console.log('Rejected by user.');
	  		} else if (error.code == -32602) {
	  			console.log('Params invalid.');
	  		} else if (error.code == -32603) {
	  			console.log('Internal error.');
	  		} else {
	  			console.error(error);
	  		}
	  	});
	}

	onMount(initProvider);

</script>

<style>

</style>

{#if $user}
	<div>✔ {$user}</div>
{:else}
	<div><a on:click={connect}>Connect Metamask</a></div>
{/if}