import { writable } from 'svelte/store'
import { showReadableError } from '../lib/errors'

export const toastMessage = writable(null);
export const toastType = writable(null);

export function showToast(message, type) {
	if (!type) {
		type = 'error';
		message = showReadableError(message);
	}
	toastType.set(type);
	toastMessage.set(message);
}

export function closeToast() {
	toastMessage.set(null);
	toastType.set(null);
}