import { writable, derived } from 'svelte/store'
import { user, chainId, selectedProduct } from './main'

import getBalance from '../lib/token/getBalance'
import getStakedBalance from '../lib/governance/getStakedBalance'
import { getAddress } from '../lib/utils'

export const reloadBalance = writable(0);
export const loadingBalance = writable(true);

export const stakedBalance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	//console.log('loading staked balance', $chainId, $user);
	if (!$chainId || !$user) {
		set(0);
		loadingBalance.set(false);
		return;
	}
	let _balance = await getStakedBalance();
	set(_balance);
	loadingBalance.set(false);
});

export const walletBalance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	//console.log('loading balance', $chainId, $user);
	if (!$chainId || !$user) {
		set(0);
		loadingBalance.set(false);
		return;
	}
	let _balance = await getBalance(getAddress('CAP'));
	set(_balance);
	loadingBalance.set(false);
});