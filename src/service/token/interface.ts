import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import {Token} from "../../types/token";

export interface IToken {
    list: (showHidden?: boolean) => Promise<Array<Token>>;

    info: (chain: ChainType, symbol: string) => Promise<Token>;

    items: (chain: ChainType) => Promise<Array<Token>>;

    hide: (hide:boolean,token:Token) => void;

    isHide: (token:Token) => boolean;

    addToken: (token: Token) => Promise<boolean>;
}

