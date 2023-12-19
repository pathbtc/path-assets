import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import EmitBox from '@emit-technology/emit-account-node-sdk';
import Web3 from 'web3';
import selfStorage from "../../common/storage";
import config from "../../common/config";

const dapp = {
    name: "emit-assets",
    url: "http://localhost:3000",
    category: "web3",
    contractAddress: ""
}

class EmitBoxSdk {

    key = "ACCOUNT";

    emitBox: EmitBox;
    // ethWeb3: Web3;
    // bscWeb3: Web3;

    web3: { [chain: number]: Web3 }

    constructor() {
        const emitBox = new EmitBox(dapp, config.chains[ChainType.EMIT].network);
        const ethProvider = emitBox.newProvider({
            dapp: dapp,
            network: config.chains[ChainType.ETH].network,
            version: "1.0"
        });
        const bscProvider = emitBox.newProvider({
            dapp: dapp,
            network: config.chains[ChainType.BSC].network,
            version: "1.0"
        });
        this.emitBox = emitBox;
        this.web3 = {
            [ChainType.ETH]: new Web3(ethProvider),
            [ChainType.BSC]: new Web3(bscProvider)
        }
    }

    showWidget = () => {
        this.emitBox.showWidget().catch(e => {
            console.error(e)
        });
    }

    getAccount = async (): Promise<AccountModel> => {
        const act: AccountModel = selfStorage.getItem(this.key)
        if(act && act.addresses && selfStorage.getItem("emit_address")){
            act.addresses[ChainType.EMIT] = selfStorage.getItem("emit_address");
        }
        if(act && act.addresses && selfStorage.getItem("eth_address")){
            act.addresses[ChainType.ETH] = selfStorage.getItem("eth_address");
        }
        return act
    }

    setAccount = async (account: AccountModel) => {
        selfStorage.setItem(this.key, account);
        return new Promise(resolve => {
            setInterval(() => {
                if (selfStorage.getItem(this.key)) {
                    resolve(account)
                }
            }, 200)
        })
    }

}

export const emitBoxSdk = new EmitBoxSdk();