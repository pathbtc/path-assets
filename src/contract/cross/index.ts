import BigNumber from "bignumber.js";

export abstract class Cross{

    abstract depositFT(destinationChainID:number, resourceID:string, recipient:string,amount: BigNumber,callback:any):Promise<any>;

    abstract minCrossAmount(resourceId:string):Promise<string>;

    abstract commitVotes(originChainID:number, depositNonce:number, resourceID:string,recipient:string,amount: BigNumber,callback:any,signs:any):Promise<any>;
}
