import ethCall from '../ethCall'
import proposalCount from './proposalCount'
import getProposal from './getProposal'

export default async function proposals(params) {

	const {
		page,
		page_size
	} = params;

	const lastIndex = Number(await proposalCount());

	const proposalIds = Array.from(new Array(page_size), (_, i) => lastIndex - (page - 1) * page_size - i).filter(x => x > 0);

	return Promise.all(proposalIds.map(proposalId => getProposal({ proposalId })));

}
