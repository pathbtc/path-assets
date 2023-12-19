import {NftStandard, Token, TokenProtocol} from "../types";
import {ChainType} from '@emit-technology/emit-lib';
import {INetwork} from "@emit-technology/emit-account-node-sdk";

/**
 * name: string;
 symbol: string;
 decimal: number;
 totalSupply: string;
 contractAddress: string;
 image?: string;
 protocol:TokenProtocol;
 chain: ChainType;
 */
interface IConfig {
    recommendTokens: Array<Token>;
    recommendNfts: Array<NftStandard>;
    emitAccountNodeHost: string;
    chains: { [chain: number]: ChainInfo };
    crossConfigUrl: string
}

interface ChainInfo {
    description: string;
    explorer: ExplorerUrl;
    network: INetwork;
    common: any | null;
    nodeAddress: string | null; // minerAddress
}

interface ExplorerUrl {
    tx: string;
    address: string;
    contract: string;
    block: string;
}

const NODE_ENV: string = 'production'//process.env.NODE_ENV || 'development';
const development: IConfig = {
    recommendTokens: [
        {
            name: "Ethereum Network",
            symbol: "ETH",
            decimal: 18,
            contractAddress: "0x0000000000000000000000000000000000000000",
            image: "./assets/img/tokens/ETH.png",
            protocol: TokenProtocol.ETH,
            chain: ChainType.ETH.valueOf(),
            feeCy: "ETH"
        },
        {
            name: "Bangs",
            symbol: "Bangs",
            decimal: 18,
            contractAddress: "EMNNAy1n3Xi9NDMosyr4tn6PQUC8PCZzT4YWYcJtMi2ePwAzJ",
            image: "./assets/img/tokens/EMIT.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf() ,
            feeCy: "Bangs",
            symbolTag: "Bangs",
        },
        {
            name: "BNB",
            symbol: "BNB",
            decimal: 18,
            contractAddress: "0x0000000000000000000000000000000000000000",
            image: "./assets/img/tokens/BNB.png",
            protocol: TokenProtocol.BSC,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "Bangs",
            symbol: "Bangs",
            decimal: 18,
            contractAddress: "0xec983Ef3B5b005a1A14e1AA1e911F0dbFDCc1C7c",
            image: "./assets/img/tokens/BNB.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB",
            symbolTag: "Bangs",
        },
        {
            name: "EMIT LIGHT Element",
            symbol: "bLIGHT",
            decimal: 18,
            contractAddress: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
            image: "./assets/img/tokens/bLIGHT.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "eLIGHT",
            symbol: "eLIGHT",
            decimal: 18,
            contractAddress: "0xD48f0cd85B983ac647E09ed06Ae148f458D06A57",
            image: "./assets/img/tokens/eLIGHT.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH.valueOf(),
            feeCy: "ETH"
        },
        {
            name: "EMIT DARK Element",
            symbol: "bDARK",
            decimal: 18,
            contractAddress: "0xE35Aa1adEbF5484482fAAdCBFD5729234f0ABf29",
            image: "./assets/img/tokens/DARK.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "EMIT EARTH Element",
            symbol: "EARTH",
            decimal: 18,
            contractAddress: "0xEA8553CCbbf14A628750a56078aA7da425bdAe08",
            image: "./assets/img/tokens/EARTH.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },

        {
            name: "EMIT WATER Element",
            symbol: "WATER",
            decimal: 18,
            contractAddress: "0xCee118d0fD2A765a91f6bbD251C41Ac93a4298F7",
            image: "./assets/img/tokens/WATER.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "Binance-Peg BUSD",
            symbol: "BUSD",
            decimal: 18,
            contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            image: "./assets/img/tokens/BUSD.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        // {
        //     name: "USDT",
        //     symbol: "USDT",
        //     decimal: 6,
        //     contractAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
        //     image: "./assets/img/tokens/USDT.png",
        //     protocol: TokenProtocol.ERC20,
        //     chain: ChainType.ETH,
        //     feeCy: "ETH"
        // },
        {
            name: "Super ZERO",
            symbol: "eSERO",
            decimal: 18,
            contractAddress: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
            image: "./assets/img/tokens/SERO.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH.valueOf(),
            feeCy: "ETH"
        },
    ],
    recommendNfts: [],
    emitAccountNodeHost: "https://node-account-dev.emit.technology",
    chains: {
        [ChainType.EMIT.valueOf()]: {
            description: "EMIT CORE",
            explorer: {
                tx: "https://bscscan.com/tx/{0}",
                address: "https://bscscan.com/address/{0}",
                contract: "https://bscscan.com/address/{0}",
                block: "https://bscscan.com/block/{0}"
            },
            // network: {nodeUrl: "http://127.0.0.1:8585", chainId: "667", chainType: ChainType.EMIT.valueOf()},
            network: {nodeUrl: "https://node-emit-dev.bangs.network", chainId: "667", chainType: ChainType.EMIT.valueOf()},
            common: null,
            nodeAddress: "EaWt4Q2yLcthiETUJNadA1ihHiP4JDd4uPtSN4Rku74PS5aoi"
        },
        [ChainType.ETH.valueOf()]: {
            description: "Ethereum network",
            explorer: {
                tx: "https://etherscan.io/tx/{0}",
                address: "https://etherscan.io/address/{0}",
                contract: "https://etherscan.io/address/{0}",
                block: "https://etherscan.io/block/{0}"
            },
            network: {nodeUrl: "https://node-bsc.bangs.network", chainId: "1", chainType: ChainType.ETH.valueOf()},
            common: {
                baseChain: "mainnet",
                customer: {
                    name: "mainnet",
                    networkId: 15,
                    chainId: 1337,
                },
                hardfork: "petersburg"
            },
            nodeAddress: ""
        },
        [ChainType.BSC.valueOf()]: {
            description: "Binance smart chain",
            explorer: {
                tx: "https://bscscan.com/tx/{0}",
                address: "https://bscscan.com/address/{0}",
                contract: "https://bscscan.com/address/{0}",
                block: "https://bscscan.com/block/{0}"
            },
            network: {nodeUrl: "https://node-bsc.bangs.network", chainId: "1", chainType: ChainType.BSC.valueOf()},
            common: {
                baseChain: "mainnet",
                customer: {
                    name: "mainnet",
                    networkId: 15,
                    chainId: 1337,
                },
                hardfork: "petersburg"
            },
            nodeAddress: ""
        }
    },
    crossConfigUrl: "https://node-cross-dev.bangs.network"
};

const production: IConfig =  {
    recommendTokens: [
        {
            name: "EMIT",
            symbol: "EMIT",
            decimal: 18,
            contractAddress: "ETk3ErnkKxpEcMm6NgZ3ZBvTLZbH2MLM9kjo6woVuufghDotE",
            image: "./assets/img/tokens/EMIT.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },
        {
            name: "Ethereum Network",
            symbol: "ETH",
            decimal: 18,
            contractAddress: "0x0000000000000000000000000000000000000000",
            image: "./assets/img/tokens/ETH.png",
            protocol: TokenProtocol.ETH,
            chain: ChainType.ETH.valueOf(),
            feeCy: "ETH"
        },
        {
            name: "BNB",
            symbol: "BNB",
            decimal: 18,
            contractAddress: "0x0000000000000000000000000000000000000000",
            image: "./assets/img/tokens/BNB.png",
            protocol: TokenProtocol.BSC,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "PINS",
            symbol: "PINS",
            decimal: 18,
            contractAddress: "0x92ACA969b77BD899C05ca0e1DC050cd003457d60",
            image: "./assets/img/tokens/PINS.png",
            protocol: TokenProtocol.ERC20,
            chain: ChainType.ETH.valueOf(),
            feeCy: "ETH"
        },
        {
            name: "PINS",
            symbol: "PINS",
            decimal: 18,
            contractAddress: "EQZLsvSWNCd1TJh6u6aYRzqZL9TxCdH8bWMwGHRSzXqJXEWj2",
            image: "./assets/img/tokens/PINS.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },
        {
            name: "EMIT LIGHT Element",
            symbol: "LIGHT",
            decimal: 18,
            contractAddress: "EQZLsvSWNCd1TJh6u6aYRzqZL9TxCdH8bWMwGHRSzXqJXEWj2",
            image: "./assets/img/tokens/bLIGHT.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },
        {
            name: "EMIT DARK Element",
            symbol: "DARK",
            decimal: 18,
            contractAddress: "EQZLsvSWNCd1TJh6u6aYRzqZL9TxCdH8bWMwGHRSzXqJXEWj2",
            image: "./assets/img/tokens/DARK.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },
        {
            name: "EMIT EARTH Element",
            symbol: "EARTH",
            decimal: 18,
            contractAddress: "EQZLsvSWNCd1TJh6u6aYRzqZL9TxCdH8bWMwGHRSzXqJXEWj2",
            image: "./assets/img/tokens/EARTH.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },

        {
            name: "EMIT WATER Element",
            symbol: "WATER",
            decimal: 18,
            contractAddress: "EQZLsvSWNCd1TJh6u6aYRzqZL9TxCdH8bWMwGHRSzXqJXEWj2",
            image: "./assets/img/tokens/WATER.png",
            protocol: TokenProtocol.EMIT,
            chain: ChainType.EMIT.valueOf(),
            feeCy: "EMIT"
        },

        {
            name: "EMIT LIGHT Element",
            symbol: "bLIGHT",
            decimal: 18,
            contractAddress: "0x944854f404c7C0dF9780651D9B29947C89D8fD19",
            image: "./assets/img/tokens/bLIGHT.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "EMIT DARK Element",
            symbol: "bDARK",
            decimal: 18,
            contractAddress: "0xE35Aa1adEbF5484482fAAdCBFD5729234f0ABf29",
            image: "./assets/img/tokens/DARK.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
        {
            name: "EMIT EARTH Element",
            symbol: "EARTH",
            decimal: 18,
            contractAddress: "0xEA8553CCbbf14A628750a56078aA7da425bdAe08",
            image: "./assets/img/tokens/EARTH.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },

        {
            name: "EMIT WATER Element",
            symbol: "WATER",
            decimal: 18,
            contractAddress: "0xCee118d0fD2A765a91f6bbD251C41Ac93a4298F7",
            image: "./assets/img/tokens/WATER.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },

        {
            name: "Binance-Peg BUSD",
            symbol: "BUSD",
            decimal: 18,
            contractAddress: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
            image: "./assets/img/tokens/BUSD.png",
            protocol: TokenProtocol.BEP20,
            chain: ChainType.BSC.valueOf(),
            feeCy: "BNB"
        },
    ],
    recommendNfts: [],
    emitAccountNodeHost: "https://node-account.emit.technology",
    chains: {
        [ChainType.EMIT.valueOf()]: {
            description: "EMIT CORE",
            explorer: {
                tx: "",
                address: "",
                contract: "",
                block: ""
            },
            network: {nodeUrl: "https://core-node-beta.emit.technology", chainId: "667", chainType: ChainType.EMIT.valueOf()},
            common: null,
            nodeAddress: "EaWt4Q2yLcthiETUJNadA1ihHiP4JDd4uPtSN4Rku74PS5aoi"
        },
        [ChainType.ETH.valueOf()]: {
            description: "Ethereum network",
            explorer: {
                tx: "https://etherscan.io/tx/{0}",
                address: "https://etherscan.io/address/{0}",
                contract: "https://etherscan.io/address/{0}",
                block: "https://etherscan.io/block/{0}"
            },
            network: {nodeUrl: "https://node-account.emit.technology", chainId: "1", chainType: ChainType.ETH.valueOf()},
            common: {
                baseChain: "mainnet",
                customer: {
                    name: "mainnet",
                    networkId: 1,
                    chainId: 1,
                },
                hardfork: "byzantium"
            },
            nodeAddress: ""
        },
        [ChainType.BSC.valueOf()]: {
            description: "Binance smart chain",
            explorer: {
                tx: "https://bscscan.com/tx/{0}",
                address: "https://bscscan.com/address/{0}",
                contract: "https://bscscan.com/address/{0}",
                block: "https://bscscan.com/block/{0}"
            },
            network: {nodeUrl: "https://bsc-dataseed1.defibit.io", chainId: "56", chainType: ChainType.BSC.valueOf()},
            common: {
                baseChain: "mainnet",
                customer: {
                    name: "mainnet",
                    networkId: 56,
                    chainId: 56,
                },
                hardfork: "byzantium"
            },
            nodeAddress: ""
        }
    },
    crossConfigUrl: "https://core-node-cross.emit.technology"
}

// {
//     recommendTokens: development.recommendTokens,
//     recommendNfts: [
//         // {symbol: "eEMIT_BUILDERS_MEDAL_01", name: "EMIT BUILDERS MEDAL 01",contract_address: "0xd5e8b33dceaf121a0aeef03777b7bff94b141167",  protocol: NftProtocol.ERC721, chain: ChainType.ETH },
//         // {symbol: "eWRAPPED_EMIT_AX", name: "eWRAPPED_EMIT_AX",contract_address: "0x1780CE9bA71E115bb36781a22B858b54fC0d93CE",  protocol: NftProtocol.ERC721, chain: ChainType.ETH },
//         // {symbol: "bWRAPPED_EMIT_AX", name: "bWRAPPED_EMIT_AX",contract_address: "0x9036b1c89FA26d90751cf42BBea626a5fD379b23",  protocol: NftProtocol.ERC721, chain: ChainType.BSC },
//         // {symbol: "COUNTER", name: "EMIT COUNTER",contract_address: "0xC0c901368483b217d66a2560f514df6EF3Df3624",  protocol: NftProtocol.ERC721, chain: ChainType.BSC },
//     ],
//     emitAccountNodeHost: "https://node-account-dev.emit.technology",
//     chains: development.chains,
//     crossConfigUrl: "https://node-cross-dev.bangs.network"
// };

const config: {
    [name: string]: IConfig
} = {
    development,
    production
};

export default config[NODE_ENV];
