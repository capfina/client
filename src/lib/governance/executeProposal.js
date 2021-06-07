import { getAddress, encodeUint } from '../utils'
import ethSend from '../ethSend'

export default async function executeProposal(params) {

  console.log('params', params);

  const {
    proposalId
  } = params;

  return ethSend({
    address: getAddress('GOVERNANCE'),
    method: 'executeProposal(uint256)',
    data: encodeUint(proposalId)
  });

}
