import { keccak256 } from 'js-sha3'

import { get } from 'svelte/store'
import { user } from '../stores/main'
import { decodeParameters } from './abi/decoders'
import { getAddress, formatUserForEvent, formatBigInt } from './utils'

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
		return Object.assign(
			{
				eventName: 'Order Submitted',
				id: null,
				isBuy: null,
				symbol: null,
				amount: null,
				leverage: null,
				positionId: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'id' },
					{ type: 'bool', name: 'isBuy' },
					{ type: 'bytes32', name: 'symbol', format: figiToProduct },
					{ type: 'uint256', name: 'amount', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'leverage', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'positionId' }
				], data
			)
		);
	} else if (eventType == EVENTS[1]) {
		// order cancelled
		return Object.assign(
			{
				eventName: 'Order Cancelled',
				id: null,
				positionId: null,
				reason: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'id' },
					{ type: 'uint256', name: 'positionId' },
					{ type: 'string', name: 'reason' }
				], data
			)
		);
	} else if (eventType == EVENTS[2]) {
		// position open
		return Object.assign(
			{
				eventName: 'Position Opened',
				positionId: null,
				isBuy: null,
				symbol: null,
				amount: null,
				leverage: null,
				price: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'positionId' },
					{ type: 'bool', name: 'isBuy' },
					{ type: 'bytes32', name: 'symbol', format: figiToProduct },
					{ type: 'uint256', name: 'amount', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'leverage', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'price', format: (r) => formatBigInt(r, BigInt(8)) }
				], data
			)
		);
	} else if (eventType == EVENTS[3]) {
		// position margin added
		return Object.assign(
			{
				eventName: 'Position Margin Added',
				positionId: null,
				newAmount: null,
				oldAmount: null,
				newLeverage: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'positionId' },
					{ type: 'uint256', name: 'newAmount', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'oldAmount', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'newLeverage', format: (r) => formatBigInt(r, BigInt(8)) }
				], data
			)
		);
	} else if (eventType == EVENTS[4]) {
		// position liquidated
		return Object.assign(
			{
				eventName: 'Position Liquidated',
				positionId: null,
				marginLiquidated: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'positionId' },
					{ type: 'uint256', name: 'marginLiquidated', format: (r) => formatBigInt(r, BigInt(8)) }
				], data
			)
		);
	} else if (eventType == EVENTS[5]) {
		// position closed
		return Object.assign(
			{
				eventName: 'Position Closed',
				positionId: null,
				amountClosed: null,
				amountToReturn: null,
				entryPrice: null,
				price: null,
				leverage: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'positionId' },
					{ type: 'uint256', name: 'amountClosed', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'amountToReturn', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'entryPrice', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'price', format: (r) => formatBigInt(r, BigInt(8)) },
					{ type: 'uint256', name: 'leverage', format: (r) => formatBigInt(r, BigInt(8)) }
				], data
			)
		);
	} else if (eventType == EVENTS[6]) {
		// liquidation submitted
		return Object.assign(
			{
				eventName: 'Liquidation Submitted',
				id: null,
				positionId: null,
				blockNumber: parseInt(blockNumber, 16),
				txhash: transactionHash
			},
			decodeParameters(
				[
					{ type: 'uint256', name: 'id' },
					{ type: 'uint256', name: 'positionId' }
				], data
			)
		);
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