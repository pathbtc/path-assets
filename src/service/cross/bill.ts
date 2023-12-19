import rpc from "../../rpc";
import config from "../../common/config";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import {emitBoxSdk} from "../emit";
import {CrossBill} from "../../types/cross";
import EthCross from "../../contract/cross/eth";
import BigNumber from "bignumber.js";
import {txService} from "../tx";
import {crossConfig} from "./config";
import {utils} from "../../common/utils";

class Bill {

    constructor() {

    }

    list = async (chain: ChainType): Promise<Array<CrossBill>> => {
        const account = await emitBoxSdk.getAccount();
        const sourceId = utils.chain2SourceId(chain)
        const items: Array<CrossBill> = await rpc.get(`${config.crossConfigUrl}/bills/${account.addresses[chain]}/${sourceId}`);
        return items
    }

    commitVote = async (bill: CrossBill): Promise<{ transactionHash: string, chain: ChainType }> => {
        // const account = await emitBoxSdk.getAccount();
        const sourceId = bill.DestinationId;
        const chainId = utils.sourceId2ChainType(sourceId)

        const addresses = await emitBoxSdk.web3[chainId].eth.getAccounts();
        const address = addresses[0];
        const contract = new EthCross(address, chainId);
        const data = await contract.commitVotes(bill.SourceId, bill.DepositNonce, bill.ResourceId, bill.recipient, new BigNumber(bill.amount), bill.callbackParam, bill.signatures);
        const bridgeAddress = await crossConfig.getTokenContractBridge(sourceId)

        const tx = await txService._web3Send(chainId, bridgeAddress, "0x0", 18, data)
        await txService.waitTxConfirm(chainId, tx.transactionHash)
        return {transactionHash: tx.transactionHash, chain: chainId};
    }

}

export const crossBillService = new Bill();