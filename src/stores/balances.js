import { writable, derived } from 'svelte/store'
import { user, chainId, selectedProduct } from './main'

import getBalance from '../lib/token/getBalance'
import getUserFreeMargin from '../lib/trading/getUserFreeMargin'

export const reloadBalance = writable(0);
export const loadingBalance = writable(true);

export const baseBalance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	//console.log('loading balance', $chainId, $user);
	if (!$chainId || !$user) {
		set(0);
		loadingBalance.set(false);
		return;
	}
	let _balance = await getBalance();
	set(_balance);
	loadingBalance.set(false);
});

export const freeMargin = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	//console.log('loading balance');
	if (!$chainId || !$user) {
		set(0);
		return;
	}
	let _freemargin = await getUserFreeMargin();
	set(_freemargin);
});