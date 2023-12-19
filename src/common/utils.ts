import BigNumber from 'bignumber.js';
import {Category, ChainType, checkSumAddress, Factor, fromAddressBytes} from "@emit-technology/emit-lib";
import config from "./config";
import {Token, TokenProtocol} from "../types";
import web3Utils, {toChecksumAddress} from "web3-utils";
import {SourceId} from "../types/cross";


const format = require('date-format');
const BN = require("bn.js");
export const utils = {
    ellipsisStr: function (v: string, num?: number) {
        if (!v) return ""
        if (!num) {
            num = 7
        }
        if (v.length >= 15) {
            return v.slice(0, num) + "..." + v.slice(v.length - num, v.length);
        }
        return v
    },


    formatValueString: function (value: string | BigNumber | number | undefined, fix: number = 3): string {
        if (!value) {
            return "0.000"
        }
        return this.nFormatter(this.fromValue(value, 18), fix)
    },

    fromValue: function (value: string | BigNumber | number | undefined, decimal: number): BigNumber {
        if (!value) {
            return new BigNumber(0)
        }
        return new BigNumber(value).dividedBy(10 ** decimal)
    },

    toValue: function (value: string | BigNumber | number, decimal: number): BigNumber {
        if (!value) {
            return new BigNumber(0)
        }
        return new BigNumber(value).multipliedBy(10 ** decimal)
    },

    nFormatter: function (n: number | BigNumber | string | undefined, digits: number) {
        if (!n || new BigNumber(n).toNumber() == 0) {
            return "0.000"
        }
        const num = new BigNumber(n).toNumber();
        const si = [
            {value: 1, symbol: ""},
            {value: 1E3, symbol: "K"},
            {value: 1E6, symbol: "M"},
            {value: 1E9, symbol: "G"},
            {value: 1E12, symbol: "T"},
            {value: 1E15, symbol: "P"},
            {value: 1E18, symbol: "E"}
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        let i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        return new BigNumber(n ).dividedBy(new BigNumber(si[i].value)).toFixed(digits,1).replace(rx, "$1") + si[i].symbol;
    },
    toHex(value: string | number | BigNumber, decimal?: number):string {
        if (value === "0x") {
            return "0x0"
        }
        if (decimal) {
            return "0x" + this.toValue(value, decimal).toString(16);
        }
        return "0x" + new BigNumber(value).toString(16)
    },

    dateFormat(date: Date) {
        // return format("dd/MM/yyyy hh:mm:ss", date);
        return date.toString();
    },

    toHash(v: string): string {
        return Buffer.alloc(32, 0)
            .fill(Buffer.from(v), 0, Buffer.from(v).length)
            .toString("hex");

    },

    formatCategoryString: (category: Category): string => {
        const name = utils.fromHex(category.symbol);
        if (
            category.supplier === config.chains[ChainType.EMIT].nodeAddress &&
            category.symbol ===
            "0000000000000000000000000000000000000000000000000000000000000000"
        ) {
            return "EMIT CORE";
        }
        return name;
    },

    factorToToken: (factor: Factor): Token => {
        return {
            symbol: utils.formatCategoryString(factor.category),
            name: utils.formatCategoryString(factor.category),
            decimal: 18,
            contractAddress: factor.category.supplier,
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT,
            balance: utils.fromHexValue(factor.value, 0).toString(10)
        }
    },

    getChainByName: (name: string): ChainType => {
        const keys = Object.keys(ChainType)
        for (let key of keys) {
            if (ChainType[key] == name) {
                return parseInt(key)
            }
        }
        return ChainType._
    },

    token2Category: (token: Token): Category => {
        return {
            symbol: Buffer.from(token.symbol).toString("hex"),
            supplier: token.contractAddress,
            id: ""
        }
    },

    strToHex: (v: string, len: number = 32) => {
        const buf = Buffer.alloc(len, 0);
        const dataBuf = Buffer.from(v);
        if (dataBuf.length > len) {
            throw new Error("str is too long");
        }
        return buf.fill(dataBuf, 0, dataBuf.length).toString("hex");
    },

    fromHex(v: string): any {
        if (!v) {
            return "";
        }
        const chr = "\u0000";
        const regex = "/" + chr + "/g";
        //.replace(regex,"");
        const str = Buffer.from(v, "hex").toString();
        return str.replace(eval(regex), "");
    },

    fromHexValue: (v: string, decimal: number = 18): BigNumber => {
        return new BigNumber(new BN(v, "hex", "be").toString()).dividedBy(
            10 ** decimal
        );
    },

    // toHex(v: string, len?: number) {
    //   if (!v) {
    //     return "";
    //   }
    //   if (len) {
    //     return new BN(v).toArrayLike(Buffer, "le", len).toString("hex");
    //   }
    //   return Buffer.from(v).toString("hex");
    // }

    toValueHex(v: any, decimal: number = 18) {
        const cv = new BigNumber(v).multipliedBy(10 ** decimal).toString(16);
        return new BN(cv, "hex").toArrayLike(Buffer, "be", 32).toString("hex");
    },

    canUseEmitAccountNode: (chain: number) => {
        return chain == ChainType.BSC || chain == ChainType.ETH
    },

    isWeb3Chain: (chain: number) => {
        return chain == ChainType.BSC || chain == ChainType.ETH
    },

    isErc20Token: (token: Token) => {
        return token.protocol == TokenProtocol.ERC20 || token.protocol == TokenProtocol.BEP20
    },

    checkAddress: (address: string, chain: ChainType): boolean => {
        if (utils.isWeb3Chain(chain)) {
            return web3Utils.checkAddressChecksum(web3Utils.toChecksumAddress(address))
        } else if (chain == ChainType.EMIT) {
            return checkSumAddress(address)
        }
        return false
    },

    toAddressHex: (address: string, chain: ChainType): string => {
        if (chain == ChainType.EMIT) {
            return "0x" + fromAddressBytes(address).toString("hex")
        } else {
            if (utils.isWeb3Chain(chain)) {
                return address;
            }
        }
        throw new Error(`Chain [${ChainType[chain]}] not found!`)
    },

    waitTime: async (defaultSecond = 1) => {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(true)
            }, defaultSecond * 1000)
        })
    },

    toWeb3CheckAddress : (address:string)=>{
        return toChecksumAddress(address)
    },

    isChrome: (): boolean =>{
        //@ts-ignore
        const isChromium = window.chrome;
        const winNav = window.navigator;
        const vendorName = winNav.vendor;
        //@ts-ignore
        const isOpera = typeof window.opr !== "undefined";
        const isIEedge = winNav.userAgent.indexOf("Edg") > -1;
        const isIOSChrome = winNav.userAgent.match("CriOS");

        if (isIOSChrome) {
            // is Google Chrome on IOS
        } else if(
            isChromium !== null &&
            typeof isChromium !== "undefined" &&
            vendorName === "Google Inc." &&
            isOpera === false &&
            isIEedge === false
        ) {
            // is Google Chrome
            return true
        } else {
            // not Google Chrome
        }
        return false;
    },

    sourceId2ChainType: (sourceId: SourceId): ChainType =>{
        if(sourceId == SourceId.SERO){
            return ChainType.SERO
        }else if(sourceId == SourceId.ETH){
            return ChainType.ETH
        }
        return ChainType[SourceId[sourceId].valueOf()]
    },

    chain2SourceId: (chain: ChainType): SourceId =>{
        if(chain == ChainType.SERO){
            return SourceId.SERO
        }else if(chain == ChainType.ETH){
            return SourceId.ETH
        }
        return SourceId[ChainType[chain].valueOf()]
    }

}