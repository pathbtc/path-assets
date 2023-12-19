import {AccountModel,ChainType} from '@emit-technology/emit-lib';

type TraitType = string | number;

export interface Attribute {
    trait_type: string;
    value: TraitType;
}

export interface NftMeta {
    name: string;
    description: string;
    image: string;
    attributes: Array<Attribute>;
}

export enum NftProtocol {
    ERC721 = "ERC-721",
    ERC1155 = "ERC-1155",
}

export interface NftStandard {
    contract_address: string;
    token_id?: any;
    symbol: string;
    name: string;
    protocol: NftProtocol;
    chain?: ChainType;
    meta: NftMeta;
}