import { writable, derived } from 'svelte/store'
import { user, chainId, selectedProduct } from './main'

import getBalance from '../lib/getBalance'
import getTokenBalance from '../lib/token/getBalance'
import { getAddress } from '../lib/utils'

export const reloadBalance = writable(0);

export const ethL1Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getBalance({ layer: 1 })
	);
});

export const ethL2Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getBalance({ layer: 2 })
	);
});

export const daiL1Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getTokenBalance(getAddress('DAI', 1), 1)
	);
});

export const daiL2Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getTokenBalance(getAddress('DAI', 2), 2)
	);
});

export const capL1Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getTokenBalance(getAddress('CAP', 1), 1)
	);
});

export const capL2Balance = derived([chainId, user, reloadBalance], async ([$chainId, $user, $reloadBalance], set) => {
	if (!$chainId || !$user) return set(0);
	set(
		await getTokenBalance(getAddress('CAP', 2), 2)
	);
});
