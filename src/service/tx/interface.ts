import {Tx, TxResp} from "../../types";
import {ChainType} from '@emit-technology/emit-lib';
export interface ITx {

    list: (chain:ChainType,symbol:string,pageSize:number,pageNo:number,tokenAddress:string) => Promise<TxResp>;

    info: (chain:ChainType,txHash:string) => Promise<Tx>;

}

