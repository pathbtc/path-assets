import {ITx} from './interface';
import { Token, TxDetail, TxInfo, TxRecord, TxResp} from "../../types";
import {ChainType} from '@emit-technology/emit-lib';
import rpc from "../../rpc";
import {emitBoxSdk} from "../emit";
import {utils} from "../../common/utils";
import BigNumber from "bignumber.js";
import {Block, BlockWrapped, DataSet} from "@emit-technology/emit-account-node-sdk";
import {crossConfig} from "../cross/config";
import {tokenService} from "../token";
import EthCross from "../../contract/cross/eth";
import config from "../../common/config";
import Erc20Contract from "../../contract/erc20/eth";

class TxService implements ITx {

    info = async (chain: ChainType, txHash: string, num?: number): Promise<TxDetail> => {
        if (utils.canUseEmitAccountNode(chain)) {
            return await rpc.getTxInfo(chain, txHash)
        } else if (chain == ChainType.EMIT) {
            const account = await emitBoxSdk.getAccount();
            const address = account.addresses[chain];
            const blk = await emitBoxSdk.emitBox.emitDataNode.getBlock(address, num)
            return this.blockToTxDetail(blk, address)
        }

    }

    list = async (chain: ChainType, symbol: string, pageNo: number,  pageSize: number,tokenAddress:string): Promise<TxResp> => {
        const account = await emitBoxSdk.getAccount();
        const address = account.addresses[chain];
        if (utils.canUseEmitAccountNode(chain)) {
            return await rpc.getTransactions(chain, address, symbol, "", pageSize, pageNo,"",tokenAddress)
        } else if (chain == ChainType.EMIT) {
            const txResp: TxResp = {pageNo: pageNo, pageSize: pageSize, data: [], total: 0};
            const latestBlock = await emitBoxSdk.emitBox.emitDataNode.getLatestBlocks(address, 50);
            txResp.total = latestBlock.length;
            const data: Array<TxInfo> = [];
            for (let blk of latestBlock) {
                const rest = this.blockToTxInfoArray(blk, address, symbol);
                data.push(...rest)
            }
            txResp.data = data;
            txResp.total = data.length;
            return txResp;
        }
    }

    blockToTxInfoArray = (blk: BlockWrapped, address: string, symbol?: string): Array<TxInfo> => {
        const records: Array<TxRecord> = [];
        const data: Array<TxInfo> = [];
        const outs = blk.block.factor_set.outs;
        const settles = blk.block.factor_set.settles;
        if (outs.length > 0) {
            for (let out of outs) {
                const token = utils.factorToToken(out.factor)
                if (symbol && symbol != token.symbol) {
                    continue
                }
                records.push({
                    address: address,
                    amount: new BigNumber(token.balance).multipliedBy(-1).toString(10),
                    currency: token.symbol,
                    tokenAddress: token.contractAddress
                })
            }
        }
        if (settles.length > 0) {
            for (let settle of settles) {
                const token = utils.factorToToken(settle.factor)
                if (symbol && symbol != token.symbol) {
                    continue
                }
                records.push({
                    address: address,
                    amount: token.balance,
                    currency: token.symbol,
                    tokenAddress: token.contractAddress
                })
            }
        }
        for (let record of records) {
            data.push({
                address: address,
                amount: record.amount,
                currency: record.currency,
                num: blk.block.num,
                timestamp: Math.ceil(blk.block.timestamp/1000),
                txHash: blk.hash,
                type: 0
            })
        }
        return data;
    }

    blockToTxDetail = (blk: BlockWrapped, address: string): TxDetail => {
        const records: Array<TxRecord> = [];
        const toAddress: Array<string> = [];
        const outs = blk.block.factor_set.outs;
        const settles = blk.block.factor_set.settles;
        const fromArr: Array<string> = []
        if (outs.length > 0) {
            for (let out of outs) {
                const token = utils.factorToToken(out.factor)
                records.push({
                    address: address,
                    amount: new BigNumber(token.balance).multipliedBy(-1).toString(10),
                    currency: token.symbol,
                    tokenAddress: token.contractAddress
                })
                records.push({
                    address: out.target,
                    amount: new BigNumber(token.balance).multipliedBy(1).toString(10),
                    currency: token.symbol,
                    tokenAddress: token.contractAddress
                })
                if (fromArr.indexOf(address) == -1) {
                    fromArr.push(address);
                }
                if (toAddress.indexOf(out.target) == -1) {
                    toAddress.push(out.target);
                }
            }
        }
        if (settles.length > 0) {

            for (let settle of settles) {
                const token = utils.factorToToken(settle.factor)
                records.push({
                    address: address,
                    amount: token.balance,
                    currency: token.symbol,
                    tokenAddress: token.contractAddress
                })
                if (fromArr.indexOf(settle.from) == -1) {
                    fromArr.push(settle.from);
                }
                if (toAddress.indexOf(address) == -1) {
                    toAddress.push(address);
                }
            }
        }

        const txDetail: TxDetail = {
            contract: null,
            fee: "0",
            feeCy: "EMIT",
            fromAddress: fromArr.join(","),
            gas: "0x0",
            gasPrice: "0x0",
            nonce: 0,
            num: blk.block.num,
            records: records,
            timestamp: Math.ceil(blk.block.timestamp/1000),
            toAddress: toAddress,
            transactionIndex: "0x0",
            txHash: blk.hash,

            address: address,
            amount: "0x0",
            currency: "",
            type: 0

        }
        return txDetail;
    }

    getNonce = async (chain: ChainType): Promise<any> => {
        const account = await emitBoxSdk.getAccount();
        const from = account.addresses[chain];
        return new Promise((resolve, reject) => {
            emitBoxSdk.web3[chain].eth.getTransactionCount(from, "pending", (error, nonce) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(utils.toValue(nonce, 0).toNumber())
                }
            })
        })
    }

    getGasPrice = async (chain: ChainType): Promise<string> => {
        const gasPrice = await emitBoxSdk.web3[chain].eth.getGasPrice()
        return gasPrice;
    }

    estimateGas = async (txParams: any, chain: ChainType): Promise<any> => {
        return new Promise((resolve, reject) => {
            emitBoxSdk.web3[chain].eth.estimateGas(txParams, (err, ret) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(ret);
                }
            })
        })
    }

    send = async (chain: ChainType, toAddress: string, amount: string, token: Token, targetChain: ChainType) => {
        const account = await emitBoxSdk.getAccount();
        if (chain != targetChain) {
            toAddress = account.addresses[targetChain];
        }
        const from = account.addresses[chain];
        if(from.toLowerCase() == toAddress.toLowerCase()){
            return Promise.reject("The to address can not be the same with sender!")
        }
        const sourceId = utils.chain2SourceId(chain)
        if (utils.isWeb3Chain(chain)) {
            let data: string;
            if (chain != targetChain) {
                //cross
                const crossHandleAddress = await crossConfig.getTokenContractHandle(sourceId);
                const allowance = await tokenService.allowance(token, crossHandleAddress)
                if (allowance.toNumber() == 0) {
                    //check approve
                    data = await tokenService.approve(token, crossHandleAddress);
                    toAddress = token.contractAddress;
                } else {
                    const crossBridgeAddress = await crossConfig.getTokenContractBridge(sourceId);
                    const contract = new EthCross(crossBridgeAddress, chain);
                    const crossResource = await crossConfig.getTargetTokens(token.symbol, sourceId,token.contractAddress);
                    const resourceKeys = Object.keys(crossResource);
                    if (!resourceKeys || resourceKeys.length == 0) {
                        return Promise.reject("Cross resourceId not found!")
                    }
                    const receipt = utils.toAddressHex(toAddress, targetChain);
                    data = await contract.depositFT(targetChain, resourceKeys[0], receipt, utils.toValue(amount, token.decimal))
                    toAddress = crossBridgeAddress;
                }
            } else {
                if (utils.isErc20Token(token)) {
                    //ERC20
                    const contract = new Erc20Contract(token.contractAddress, chain)
                    data = await contract.transfer(toAddress, utils.toValue(amount, token.decimal))
                    toAddress = token.contractAddress;
                }
            }
            return this._web3Send(chain, toAddress, amount, token.decimal, data)
        } else if (chain == ChainType.EMIT) {
            let dataSets: Array<DataSet> = [];
            let target = toAddress;
            let outData;
            if (chain != targetChain) {
                const crossResource = await crossConfig.getTargetTokens(token.symbol, sourceId,token.contractAddress);
                const resourceKeys = Object.keys(crossResource);
                if (!resourceKeys || resourceKeys.length == 0) {
                    return Promise.reject("Cross resourceId not found!")
                }
                target = await crossConfig.getTokenContractBridge(sourceId);
                const json = {
                    "transferType": 1,
                    "destinationChainID": utils.chain2SourceId(targetChain),
                    "resourceId": resourceKeys[0].slice(2),
                    "recipient": toAddress.slice(2),
                    "callback": ""
                }
                console.log("====>> cross data::", json)
                const data = JSON.stringify(json);
                // dataSets.push({
                //     name: "depositFT",
                //     data: data,
                //     old: null //for atom operation
                // })
                outData = JSON.stringify({Method:"depositFT",Param: Buffer.from(data).toString("hex")});
            }
            return this.emitSend(chain, target, amount, token, outData,dataSets)
        }
    }

    _web3Send = async (chain: ChainType, receive: string, amount: string, decimal: number, data?: string) => {
        const account = await emitBoxSdk.getAccount();
        // const addresses = await emitBoxSdk.web3[chain].eth.getAccounts()
        const from = account.addresses[chain];
        const txConfig = {
            from: from,
            to: receive,
            value: data ? "0x0" : utils.toHex(utils.toValue(amount, decimal)),
            nonce: await this.getNonce(chain),
            data: data,
            common: config.chains[chain].common
        }
        txConfig["gas"] = await this.estimateGas(txConfig, chain);
        return await emitBoxSdk.web3[chain].eth.sendTransaction(txConfig);
    }

    emitSend = async (chain: ChainType, receive: string, amount: string, token: Token, outData: string,datasets:Array<any>) => {
        const account = await emitBoxSdk.getAccount();
        const from = account.addresses[chain];
        const prepareBlock = await emitBoxSdk.emitBox.emitDataNode.genPrepareBlock(
            from,
            datasets,
            {
                settles: [],
                outs: [
                    {
                        target: receive,
                        factor: {
                            category: utils.token2Category(token),
                            value: utils.toValueHex(amount),
                        },
                        data: outData? Buffer.from(outData).toString("hex"):""//TODO for refer data
                    },
                ],
            },
            undefined
        );
        await emitBoxSdk.emitBox.emitDataNode.prepareBlock(prepareBlock);
        return Promise.resolve({
            transactionHash: prepareBlock.blk.parent_hash,
            blockNumber: prepareBlock.blk.num,
            address: from
        })
    }

    waitTxConfirm = async (chain:ChainType,transactionHash:string) => {
        for (let i = 0; i < 60; i++) {
            await utils.waitTime(1)
            const rest = await rpc.getTxInfo(chain, transactionHash);
            if(rest && rest.num>0){
                return Promise.resolve(true);
            }
        }
        return Promise.reject("Pending tx timeout!")
    }
}

export const txService = new TxService();