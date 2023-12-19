import rpc from "../../rpc";
import config from "../../common/config";
import {CrossConfig, CrossResource, CrossToken, SourceId} from "../../types/cross";
// import {AccountModel,ChainType} from '@emit-technology/emit-lib';
class Config {

    private _cfg: CrossConfig;

    init = async (): Promise<CrossConfig> => {
        if(this._cfg){
            return this._cfg;
        }
        this._cfg = await rpc.get(`${config.crossConfigUrl}/crossConfig`)
        return this._cfg;
    }

    getTokenContractHandle = async (chain:SourceId):Promise<string> =>{
        const cfg = await this.init();
        const rest = cfg["token"].contract[SourceId[chain]]["handler"]
        console.log("handler>>>>>", rest);
        return rest
    }

    getTokenContractBridge = async (chain:SourceId):Promise<string> =>{
        const cfg = await this.init();
        const rest = cfg["token"]["contract"][SourceId[chain]]["bridger"]
        console.log("bridger>>>>", rest);
        return rest
    }
    getTokenContractFee = async (chain:SourceId):Promise<string> =>{
        const cfg = await this.init();
        return cfg["token"].contract[SourceId[chain]]["fee"]
    }

    getTargetTokens = async (fromSymbol:string,fromChain: SourceId,tokenAddress:string):Promise<CrossResource> =>{
        const cfg = await this.init();
        const data = cfg["token"].resourceId;
        const tags = Object.keys(data);
        for(let tag of tags){
            const crossResource = data[tag];
            const resourceIds = Object.keys(crossResource);
            for(let resourceId of resourceIds){
                const chainTokenInfo = crossResource[resourceId];
                if(chainTokenInfo[SourceId[fromChain]]){
                    const tokenInfo = chainTokenInfo[SourceId[fromChain]];
                    if(tokenInfo.symbol == fromSymbol && tokenInfo.erc20.toLowerCase() == tokenAddress.toLowerCase()){
                        return crossResource
                    }
                }
            }
        }
        return {}
    }

    getTargetNfts = async (fromSymbol:string,fromChain: SourceId):Promise<CrossResource> =>{
        const cfg = await this.init();
        const data = cfg["nft"].resourceId;
        const tags = Object.keys(data);
        for(let tag of tags){
            const crossResource = data[tag];
            const resourceIds = Object.keys(crossResource);
            for(let resourceId of resourceIds){
                const chainTokenInfo = crossResource[resourceId];
                if(chainTokenInfo[SourceId[fromChain]]){
                    return crossResource
                }
            }
        }
        return {}
    }

}

export const crossConfig = new Config();