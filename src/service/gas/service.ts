import {IGas} from './interface';
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import {utils} from "../../common/utils";
import {emitBoxSdk} from "../emit";

class GasService implements IGas {

    defaultGas = (chain:ChainType) =>{
        if(utils.isWeb3Chain(chain)){
            return "25000"
        }
        return "0"
    }

    gasPrice = async (chain: ChainType) =>{
       if(utils.isWeb3Chain(chain)){
           return await emitBoxSdk.web3[chain].eth.getGasPrice();
       }
       return "0x0"
    }

}

export const gasService = new GasService();