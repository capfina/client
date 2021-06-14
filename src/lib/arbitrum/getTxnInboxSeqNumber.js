import { keccak256 } from 'js-sha3'
import getTransactionReceipt from '../getTransactionReceipt'
import { decodeParameter } from '../abi/decoders'

const EVENTS = [
	// InboxMessageDelivered(uint256 indexed messageNum, bytes data)
	'0x' + keccak256('InboxMessageDelivered(uint256,bytes)'),
	// InboxMessageDeliveredFromOrigin(uint256 indexed messageNum)
	'0x' + keccak256('InboxMessageDeliveredFromOrigin(uint256)'),
];

function extractLogData(log) {
	const {
		blockNumber,
		data,
		topics,
		transactionHash
	} = log;

	const eventType = topics[0];

	if (eventType == EVENTS[0] || eventType == EVENTS[1]) {
		return {
			messageNum: Number(decodeParameter({ type: 'uint256', name: 'messageNum' }, topics[1], 2))
		};
	}

	return null;
}

export default async function getTxnInboxSeqNumber(params) {

	const { txid } = params;

	const receipt = await getTransactionReceipt(txid);
	if (!receipt) return null;
	const success = !!BigInt(receipt.status);
	if (success) {
		const extractedLogs = receipt.logs.map(extractLogData).filter(l => !!l);

		if (!extractedLogs || !extractedLogs.length) return {};
		return Object.assign({ txid, status: 'success' }, extractedLogs[0]);
	} else {
		console.error(`transaction ${txid} failed`);
		return { txid, status: 'failure' };
	}

}