import {NftStandard} from "../../types/nft";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

export interface INft {
    list: (chain:ChainType,address:string) => Promise<Array<NftStandard>>;

    info: (chain:ChainType,address:string,symbol:string,tokenId:any) => Promise<NftStandard>;

    items: (chain:ChainType,address:string,symbol:string)=> Promise<Array<NftStandard>>;
}

