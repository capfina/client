import { writable } from 'svelte/store'

export const selectedPage = writable('Home');

export function routeToPage(page) {
	selectedPage.set(page);
	const urlPath = page == 'Home' ? '/' : `/#/${page.toLowerCase()}`;
	window.history.pushState({ urlPath }, '', urlPath);
}