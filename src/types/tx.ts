import {ChainType} from '@emit-technology/emit-lib';
import {Common} from "web3-core";
import {TxType} from "../../../../emit-account/app/types";

export interface Tx {
    from?: string | number;
    to?: string;
    value?: number | string;
    gas?: number | string;
    gasPrice?: number | string;
    maxPriorityFeePerGas?: number | string;
    maxFeePerGas?: number | string;
    data?: string;
    nonce?: number;
    chainId?: number;
    common?: Common;
    chain?: ChainType;
    hardfork?: string;
    hash?: string;
}

/**
 * address: "0xbe71f56ee5d6fee1efeb20b5fb048b6b491870d6"
 amount: "100000000000000000000000"
 createdAt: "2022-05-09T01:16:23.417Z"
 currency: "ETH"
 num: 1
 timestamp: 1652058840
 txHash: "0x2c553b0d00c220d8b97c0be62a40cea7733832c2b3d3ec5cdb32d99c8631698a"
 type: 1
 */

export interface TxInfo {
    address: string;
    amount: string;
    currency: string;
    num: number;
    timestamp: number;
    txHash: string;
    type:number
}

export interface TxResp {
    data: Array<TxInfo>
    total: number
    pageSize: number
    pageNo: number
}

export interface TxDetail extends TxInfo{
    contract?: string
    fee?:string;
    feeCy?:string;
    fromAddress?:string
    gas?:string;
    gasPrice?:string;
    nonce?:number;
    records?:Array<TxRecord>;
    toAddress?:Array<string>;
    transactionIndex?:string
    gasUsed?:string
}

export interface TxRecord {

    address: string
    currency: string
    amount: string
    tokenAddress: string
}