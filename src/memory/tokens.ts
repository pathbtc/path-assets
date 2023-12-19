import {Token, TokenProtocol} from "../types/token";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
export const token_cache:Array<Token> = [
]

const init = ()=>{

    [1,2,3,4,5,6,7,8,9].forEach((v,i)=>{
        token_cache.push(
            {
                name: `TOKEN${i}`,
                symbol: `TNK${v}`,
                decimal: 18,
                totalSupply: "10000000",
                contractAddress: "0xc0c901368483b217d66a2560f514df6ef3df3624",
                image: "./assets/img/tokens/ethereum.png",
                protocol:TokenProtocol.ERC20,
                chain: ChainType.ETH
            }
        )
    });

    [1,2,3,4,5,6,7,8,9].forEach((v,i)=>{
        token_cache.push(
            {
                name: `TOKEN${i}`,
                symbol: `TNK${v}`,
                decimal: 18,
                totalSupply: "10000000",
                contractAddress: "0xc0c901368483b217d66a2560f514df6ef3df3624",
                image: "./assets/img/tokens/bitcoin.png",
                protocol:TokenProtocol.BEP20,
                chain: ChainType.BSC
            }
        )
    });
}

init();