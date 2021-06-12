import ethereumRequest from './ethereumRequest'

export default async function getLogs(params, layer) {

	//console.log('params', params);

	const requestParams = {
		method: 'eth_getLogs',
		params: [params]
	}

	const logs = await ethereumRequest({ requestParams, layer });

	return logs.filter(log => !log.removed);

}