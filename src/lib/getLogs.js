export default async function getLogs(params) {

	//console.log('params', params);

	const logs = await ethereum.request({
		method: 'eth_getLogs',
		params: [params]
	});

	return logs.filter(log => !log.removed);

}