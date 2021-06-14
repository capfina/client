import { get, writable, derived } from 'svelte/store'
import { user, chainId, selectedProduct } from './main'

import getBalance from '../lib/token/getBalance'
import getUserFreeMargin from '../lib/trading/getUserFreeMargin'
import getTxnInboxSeqNumber from '../lib/arbitrum/getTxnInboxSeqNumber'
import { calculateL2TransactionHash, calculateL2RetryableTransactionHash } from '../lib/arbitrum/bridgeUtils'
import getTransactionReceipt from '../lib/getTransactionReceipt'

const LOCAL_STORAGE_KEY = 'transactions';
const localStorageKey = (user) => {
	return 'transactions_' + user
}

const initializeLocalStorage = () => {
	const _user = get(user);
	if (!_user) return null;

	// read and reset local storage with recent transactions only
	const storageKey = localStorageKey(_user);
	const storedTransaction = JSON.parse(localStorage.getItem(storageKey) || '[]');
	const recentTransactions = storedTransaction.filter(tx => tx.timestamp > Date.now() - 24 * 60 * 60 * 1000);
	localStorage.setItem(storageKey, JSON.stringify(recentTransactions));
	return recentTransactions;
}

export const transactions = writable(initializeLocalStorage());

export function addTransaction(data) {
	if (!data.txid) return;

	transactions.update(txns => {
		if (!txns) return null;
		txns.unshift(Object.assign({}, data, {timestamp: Date.now()}));

		localStorage.setItem(
			localStorageKey(get(user)),
			JSON.stringify(txns)
		);
		return txns;
	});
}

export function updateTransaction(data) {
	if (!data.txid) return;

	transactions.update(txns => {
		if (!txns) return null;
		for (let tx of txns) {
			if (tx.txid == data.txid) {
				Object.assign(tx, data);
			}
			break;
		}
		localStorage.setItem(
			localStorageKey(get(user)),
			JSON.stringify(txns)
		);
		return txns;
	});
}

export async function updateTransactionInfo() {
	transactions.set(initializeLocalStorage());
	const _transactions = get(transactions);
	if (!_transactions) return;
	for (let transaction of _transactions) {
		switch (transaction.type + '_' + transaction.status) {
			case 'L1-deposit_pending': {
				const { txid, status, messageNum } = await getTxnInboxSeqNumber({txid: transaction.txid});
				console.log({ txid, status, messageNum });
				updateTransaction({
					txid,
					messageNum,
					status
				});

				if (status == 'success') {
					addTransaction({
						txid: calculateL2TransactionHash(messageNum),
						redeemId: calculateL2RetryableTransactionHash(messageNum),
						type: 'L2-deposit',
						status: 'pending',
						asset: transaction.asset,
						amount: transaction.amount,
						timestamp: Date.now()
					});
				}
			}
			case 'L2-deposit_pending': {
				const receipt = await getTransactionReceipt(transaction.txid, 2);
				if (receipt) {
					const status = !!BigInt(receipt.status) ? 'success' : 'failure';
					updateTransaction({
						txid: transaction.txid,
						status: status
					})
				}
			}
		}
	}
}
