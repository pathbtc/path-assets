import {NftProtocol, NftStandard} from "../types/nft";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

export const nft_cache:Array<NftStandard> = [
]

const init = ()=>{

    [1,2,3,4,5,6,7,8,9].forEach((v,i)=>{
        nft_cache.push(
            {
                contract_address: "0x9036b1c89fa26d90751cf42bbea626a5fd379b23",
                token_id: v,
                symbol:"bWRAPPED_EMIT_AX",
                name: `EMIT AX #${v}`,
                protocol: NftProtocol.ERC721,
                chain: ChainType.BSC,
                meta:{
                    name: `EMIT AX #${v}`,
                    description:"EMIT-AX is the NFT in the EMIT Multi-Metaverse, forged by the user in the ALTAR SCENE for producing LIGHT elements in the CHAOS SCENE.",
                    image:"https://d3ky2du9j9kl06.cloudfront.net/images/bsc/0x9036b1c89fa26d90751cf42bbea626a5fd379b23/e88681050c99c2f551916f610b9056f9.png",
                    attributes:[
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                    ]
                },
            }
        )
    });

    [11,12,13,14,15,16].forEach((v,i)=>{
        nft_cache.push(
            {
                contract_address: "0xc0c901368483b217d66a2560f514df6ef3df3624",
                token_id: v,
                symbol:"EMIT_COUNter",
                name: `EMIT Counter #${v}`,
                protocol: NftProtocol.ERC721,
                chain: ChainType.BSC,
                meta:{
                    name: `EMIT Counter #${v}`,
                    description:"EMIT-Counter is the NFT in the EMIT Multi-Metaverse, forged by the user in the ALTAR SCENE for producing LIGHT elements in the CHAOS SCENE.",
                    image:"https://wallet.emit.technology/assets/img/insignia.png",
                    attributes:[
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                        { trait_type:"HEALTH", value:"9.99" },
                    ]
                },
            }
        )
    });
}

init();