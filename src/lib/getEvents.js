import { keccak256 } from 'js-sha3'

import { get } from 'svelte/store'
import { user } from '../stores/main'
import { getAddress, formatUserForEvent, decodeUint, decodeAddress, decodeString, decodeBytes32, formatBigInt } from './utils'

import getBlockByNumber from './getBlockByNumber'
import getLogs from './getLogs'
import { figiToProduct } from './products'

const LIMIT = 50;
const BLOCK_COUNT = 777600n;

const EVENTS = [
	'0x' + keccak256('OrderSubmitted(uint256,address,bool,bytes32,uint256,uint256,uint256)'),
	'0x' + keccak256('OrderCancelled(uint256,uint256,address,string)'),
	'0x' + keccak256('PositionOpened(uint256,address,bool,bytes32,uint256,uint256,uint256)'),
	'0x' + keccak256('PositionMarginAdded(uint256,address,uint256,uint256,uint256)'),
	'0x' + keccak256('PositionLiquidated(uint256,address,address,uint256)'),
	'0x' + keccak256('PositionClosed(uint256,address,uint256,uint256,uint256,uint256,uint256)'),
	'0x' + keccak256('LiquidationSubmitted(uint256,uint256,address)'),
	
];

function extractLogData(log) {
	const {
		blockNumber,
		data,
		topics,
		transactionHash
	} = log;

	const eventType = topics[0];
	
	if (eventType == EVENTS[0]) {
		// order submitted
		return {
			eventName: 'Order Submitted',
			id: decodeUint(data, 2),
			isBuy: decodeUint(data, 2 + 64),
			symbol: figiToProduct(decodeBytes32(data, 2 + 64 * 2).replace(/\u0000+$/g, '')),
			amount: formatBigInt(decodeUint(data, 2 + 64 * 3), BigInt(8)),
			leverage: formatBigInt(decodeUint(data, 2 + 64 * 4), BigInt(8)),
			positionId: decodeUint(data, 2 + 64 * 5).toString(),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[1]) {
		// order cancelled
		return {
			eventName: 'Order Cancelled',
			id: decodeUint(data, 2).toString(),
			positionId: decodeUint(data, 2 + 64).toString(),
			reason: decodeString(data, 2 + 64 * 2),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[2]) {
		// position open
		return {
			eventName: 'Position Opened',
			positionId: decodeUint(data, 2).toString(),
			isBuy: decodeUint(data, 2 + 64),
			symbol: figiToProduct(decodeBytes32(data, 2 + 64 * 2).replace(/\u0000+$/g, '')),
			amount: formatBigInt(decodeUint(data, 2 + 64 * 3), BigInt(8)),
			leverage: formatBigInt(decodeUint(data, 2 + 64 * 4), BigInt(8)),
			price: formatBigInt(decodeUint(data, 2 + 64 * 5), BigInt(8)),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[3]) {
		// position margin added
		return {
			eventName: 'Position Margin Added',
			positionId: decodeUint(data, 2).toString(),
			newAmount: formatBigInt(decodeUint(data, 2 + 64), BigInt(8)),
			oldAmount: formatBigInt(decodeUint(data, 2 + 64 * 2), BigInt(8)),
			newLeverage: formatBigInt(decodeUint(data, 2 + 64 * 3), BigInt(8)),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[4]) {
		// position liquidated
		return {
			eventName: 'Position Liquidated',
			positionId: decodeUint(data, 2).toString(),
			marginLiquidated: formatBigInt(decodeUint(data, 2 + 64), BigInt(8)),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[5]) {
		// position closed
		return {
			eventName: 'Position Closed',
			positionId: decodeUint(data, 2).toString(),
			amountClosed: formatBigInt(decodeUint(data, 2 + 64), BigInt(8)),
			amountToReturn: formatBigInt(decodeUint(data, 2 + 64 * 2), BigInt(8)),
			entryPrice: formatBigInt(decodeUint(data, 2 + 64 * 3), BigInt(8)),
			price: formatBigInt(decodeUint(data, 2 + 64 * 4), BigInt(8)),
			leverage: formatBigInt(decodeUint(data, 2 + 64 * 5), BigInt(8)),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	} else if (eventType == EVENTS[6]) {
		// liquidation submitted
		return {
			eventName: 'Liquidation Submitted',
			id: decodeUint(data, 2).toString(),
			positionId: decodeUint(data, 2 + 64).toString(),
			blockNumber: parseInt(blockNumber, 16),
			txhash: transactionHash
		}
	}


	// other todo
	return log;

}

export default async function getEvents() {

	const _user = get(user);

	const currentBlock = await getBlockByNumber();
	const fromBlock = BigInt(currentBlock.number) > BLOCK_COUNT ? `0x${(BigInt(currentBlock.number) - BLOCK_COUNT).toString(16)}` : 'earliest';

	let logs = await getLogs({
		fromBlock, 
		address: getAddress('TRADING'), 
		topics: [EVENTS, formatUserForEvent(_user)]
	});

	logs = logs.slice(-1 * LIMIT).map(extractLogData).reverse();

	//console.log('logs', logs);

	return logs;

}