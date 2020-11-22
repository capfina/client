import { writable, derived } from 'svelte/store'
import { user, chainId } from './main'

import getPositions from '../lib/getPositions'

export const reloadPositions = writable(0);

export const loadingPositions = writable(true);

export const positions = derived([chainId, user, reloadPositions], async ([$chainId, $user, $reloadPositions], set) => {
	loadingPositions.set(true);
	//console.log('loading pos');
	if (!$chainId || !$user) {
		set([]);
		loadingPositions.set(false);
		return;
	}
	let _positions = await getPositions();
	set(_positions);
	loadingPositions.set(false);
});