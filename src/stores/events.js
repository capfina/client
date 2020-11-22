import { writable, derived } from 'svelte/store'
import { user, chainId } from './main'

import getEvents from '../lib/getEvents'

export const reloadEvents = writable(0);

export const loadingEvents = writable(true);

export const events = derived([chainId, user, reloadEvents], async ([$chainId, $user, $reloadEvents], set) => {
	loadingEvents.set(true);
	//console.log('loading events');
	if (!$chainId || !$user) {
		set([]);
		loadingEvents.set(false);
		return;
	}
	let events = await getEvents();
	set(events);
	loadingEvents.set(false);
});