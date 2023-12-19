import {Erc20, ABI} from "../index";
import BigNumber from "bignumber.js";
import EthContract from "../../EthContract";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

class Erc20Contract extends EthContract implements Erc20 {

    constructor(address: string,chain:ChainType) {
        super(address,ABI,chain);
    }

    allowance = async (owner: string, spender: string,who:string): Promise<string> => {
        return await this.contract.methods.allowance(owner,spender).call({from:who})
    }

    approve = async (spender: string, value: BigNumber): Promise<any> => {
        return this.contract.methods.approve(spender,"0x"+value.toString(16)).encodeABI()
    }

    balanceOf = async (who: string): Promise<number> =>{
        return await this.contract.methods.balanceOf(who).call({from: who})
    }

    totalSupply = async (): Promise<number> => {
        return await this.contract.methods.totalSupply().call()
    }

    transfer = async (to: string, value: BigNumber): Promise<any> =>{
        return this.contract.methods.transfer(to,"0x"+value.toString(16)).encodeABI()
    }

    transferFrom(from: string, to: string, value: BigNumber): Promise<any> {
        return this.contract.methods.transferFrom(from,to,"0x"+value.toString(16)).encodeABI()
    }

    decimals = async (): Promise<number> => {
        return await this.contract.methods.decimals().call()
    }

    name = async(): Promise<string> => {
        return await this.contract.methods.name().call()
    }

    symbol = async (): Promise<string> => {
        return await this.contract.methods.symbol().call()
    }

}

export default Erc20Contract