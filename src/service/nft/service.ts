import {INft} from './interface';
import {NftStandard} from "../../types/nft";
import {nft_cache} from "../../memory/nft";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

class NftService implements INft {

    info = async (chain:ChainType,address:string,symbol:string,tokenId: any): Promise<NftStandard> => {
        const rest = nft_cache.filter((v)=>{
            if(tokenId == v.token_id){
                return v;
            }
        })
        return rest[0];
    }

    items= async (chain:ChainType, address: string,symbol: string): Promise<Array<NftStandard>> => {
        const rest = nft_cache.filter((v)=>{
            if(chain == v.chain && address == v.contract_address && symbol == v.symbol){
                return v;
            }
        })
        return rest;
    }

    list=async (): Promise<Array<NftStandard>> => {
        // const rest = nft_cache.filter((v)=>{
        //    if(chain == v.chain && address == v.contract_address){
        //        return v;
        //    }
        // })
        return nft_cache;
    }
}

export const nftService = new NftService();