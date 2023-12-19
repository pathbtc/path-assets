import {IToken} from './interface';
import {Balance, Token, TokenProtocol} from "../../types";
import {AccountModel, ChainType} from '@emit-technology/emit-lib';
import selfStorage from "../../common/storage";
import config from "../../common/config";
import {runWithLock} from 'localstorage-lock';
import {utils} from "../../common/utils";
import rpc from "../../rpc";
import {emitBoxSdk} from "../emit";
import BigNumber from "bignumber.js";
import Erc20Contract from "../../contract/erc20/eth";

class TokenService implements IToken {

    info = async (chain: ChainType, symbol: string, address?: string): Promise<Token> => {
        const tokens: Array<Token> = await this.list(true);
        const rest = tokens.filter((v) => {
            if (chain == v.chain && v.symbol == symbol) {
                if (address) {
                    if (address.toLowerCase() == v.contractAddress.toLowerCase()) {
                        return v;
                    }
                } else {
                    return v;
                }

            }
        })
        if (!rest || rest.length == 0) {
            if (address && utils.isWeb3Chain(chain)) {
                let token = await this.getTokenRemote(chain,address);
                if(!token || !token.symbol){
                    const erc20 = new Erc20Contract(address, chain);
                    const decimal = await erc20.decimals();
                    const name = await erc20.name();
                    const totalSupply = await erc20.totalSupply();
                    token = {
                        name: name,
                        symbol: symbol,
                        contractAddress: address,
                        decimal: decimal,
                        image: token && token.image,
                        chain: chain,
                        protocol: chain == ChainType.BSC ? TokenProtocol.BEP20: TokenProtocol.ERC20,
                        feeCy: chain == ChainType.BSC ?"BNB":"ETH",
                        totalSupply: new BigNumber(totalSupply).toString(10),
                    }
                }

                if (token && token.symbol && token.symbol == symbol) {
                    await this.addToken(token)
                    return token;
                }
                return Promise.reject(`Token[${symbol}] ,chain: ${ChainType[chain]} not exist.`);
            }
            return Promise.reject(`Token[${symbol}] ,chain: ${ChainType[chain]} is invalid`);
        }
        return rest[0];
    }

    getTokenRemote = async (chain: ChainType, tokenAddress: string) => {
        const prefix = rpc._getPrefix(chain)
        const rest: Token = await rpc.post([prefix, "getToken"].join("_"), [tokenAddress], chain)
        return rest
    }

    items = async (chain: ChainType): Promise<Array<Token>> => {
        const tokens: Array<Token> = await this.list();
        const rest = tokens.filter((v) => {
            if (chain == v.chain) {
                return v;
            }
        })
        return rest;
    }

    list = async (showHidden?: boolean): Promise<Array<Token>> => {
        const all: Array<Token> = config.recommendTokens.concat(await this._addedTokens());
        if (!showHidden) {
            const rest: Array<Token> = all.filter(v => {
                const isHid = this.isHide(v);
                if (!isHid) {
                    return true
                }
            })
            rest.sort(this._sortTokens)
            return rest;
        }
        all.sort(this._sortTokens)
        return all;
    }

    _sortTokens = (a: Token, b: Token) => {
        return this.getSortNum(a) - this.getSortNum(b)
    }

    getTokenWithBalance = async (account: AccountModel, balance?: Balance): Promise<Array<Token>> => {
        const tokens: Array<Token> = [];
        const list = await this.list(false);
        for (let token of list) {
            const key = this._balanceKey(token.chain, token.contractAddress, token.symbol, account.addresses[token.chain]);
            if (balance) {
                token.balance = utils.fromValue(balance[key], token.decimal).toString(10)//utils.nFormatter(,4);
            } else {
                const rest = selfStorage.getItem(key);
                token.balance = utils.fromValue(rest, token.decimal).toString(10);//utils.nFormatter(,4);
            }
            tokens.push(token);
        }


        return tokens;
    }

    getTokenBalance = async (chain: ChainType, symbol: string, tokenAddress: string): Promise<Token> => {
        const account = await emitBoxSdk.getAccount();
        const tokens = await this.getTokenWithBalance(account);
        const tkns = tokens.filter(value => {
            if (value.chain == chain && value.symbol == symbol && value.contractAddress.toLowerCase() == tokenAddress.toLowerCase()) {
                return true
            }
        })
        return tkns && tkns.length > 0 && tkns[0]
    }

    getBalanceRemote = async (account: AccountModel): Promise<Array<Token>> => {
        const balance: Balance = {}
        for (let key of Object.keys(config.chains)) {
            const chain = parseInt(key);
            if (utils.canUseEmitAccountNode(chain)) {
                const prefix = rpc._getPrefix(chain)
                const rest: Array<any> = await rpc.post([prefix, "getBalanceWithAddress"].join("_"), [account.addresses[chain]], chain)
                //{value,symbol,tokenAddress}
                if (rest && rest.length > 0) {
                    for (let data of rest) {
                        const value = data["value"];
                        const symbol = data["symbol"];
                        const tokenAddress = data["tokenAddress"];
                        let token: Token;
                        try {
                            token = await this.info(chain, symbol, tokenAddress);
                        } catch (e) {
                            console.log(e);
                            continue
                        }
                        const key = this._balanceKey(chain, token.contractAddress, symbol, account.addresses[chain]);
                        balance[key] = value;

                    }
                }

            } else if (chain == ChainType.EMIT) {
                const rest = await emitBoxSdk.emitBox.emitDataNode.getFactors(account.addresses[chain])
                if (rest) {
                    for (let factor of rest) {
                        const symbol = utils.formatCategoryString(factor.category);
                        const key = this._balanceKey(chain, factor.category.supplier, symbol, account.addresses[chain]);
                        const b = utils.fromHexValue(factor.value, 0).toString(10);
                        balance[key] = b;

                    }
                }
            }
        }
        const tokens = await this.list(true);
        for (let token of tokens) {
            const key = this._balanceKey(token.chain, token.contractAddress, token.symbol, account.addresses[token.chain]);
            const b = balance[key];
            selfStorage.setItem(key, b ? utils.toHex(b) : "0x0");
        }
        return this.getTokenWithBalance(account, balance);
    }

    _balanceKey = (chain: ChainType, contract: string, symbol: string, addr: string) => {
        return ["b", chain, contract, symbol, addr.slice(0, 8)].join("_")
    }

    _tokenHideKey = (chain: ChainType, symbol: string) => {
        return ["hid", chain, symbol].join("_")
    }

    _tokenSortKey = (chain: ChainType, symbol: string, tokenAddress: string) => {
        return ["st", chain, symbol, utils.ellipsisStr(tokenAddress)].join("_")
    }

    hide = (hide: boolean, token: Token) => {
        selfStorage.setItem(this._tokenHideKey(token.chain, token.symbol), hide)
    }

    isHide = (token: Token): boolean => {
        const ret = selfStorage.getItem(this._tokenHideKey(token.chain, token.symbol));
        if (ret) {
            return true;
        }
        return false;
    }

    setSortNum = (tokens: Array<Token>) => {
        let i = 0;
        for (let token of tokens) {
            i++;
            selfStorage.setItem(this._tokenSortKey(token.chain, token.symbol, token.contractAddress), i + 1)
        }
    }

    getSortNum = (token: Token): number => {
        const ret = selfStorage.getItem(this._tokenSortKey(token.chain, token.symbol, token.contractAddress));
        if (ret) {
            return ret;
        }
        return 0;
    }

    _addedTokens = async (): Promise<Array<Token>> => {
        const _key = "token_added";
        let tokens: Array<Token> | undefined = selfStorage.getItem(_key);
        if (!tokens) {
            tokens = []
        }
        return Promise.resolve(tokens);
    }

    addToken = async (token: Token): Promise<any> => {
        const _key = "token_added";
        const tokenRemote = await this.getTokenRemote(token.chain,token.contractAddress);
        return new Promise((resolve, reject) => {
            runWithLock(`lock.${_key}`, () => {
                let tokens: Array<Token> | undefined = selfStorage.getItem(_key);
                if (!tokens) {
                    tokens = []
                }
                const ft = tokens.filter(v => {
                    if (v.symbol == token.symbol && v.contractAddress == token.contractAddress && v.chain == token.chain) {
                        return true
                    }
                })
                if (ft && ft.length == 0) {
                    if(!tokenRemote || !tokenRemote.symbol){
                        rpc.addToken(token, token.chain).then(rest => {
                            if (rest) {
                                tokens.push(token);
                                selfStorage.setItem(_key, tokens);
                                resolve(true)
                            } else {
                                reject(`Token symbol=[${token.symbol}] add failed`);
                            }
                        })
                    }else {
                        token.image = tokenRemote.image;
                        tokens.push(token);
                        selfStorage.setItem(_key, tokens);
                        resolve(true)
                    }
                } else {
                    reject(`Token symbol=[${token.symbol}] already exist`);
                }
            }, {timeout: 500});
        })
    }

    allowance = async (token: Token, spender: string): Promise<BigNumber> => {
        const account = await emitBoxSdk.getAccount();
        const erc20 = new Erc20Contract(token.contractAddress, token.chain);
        const allowance = await erc20.allowance(account.addresses[token.chain], spender,account.addresses[token.chain])
        return new BigNumber(allowance)
    }

    approve = async (token: Token, spender: string): Promise<string> => {
        const account = await emitBoxSdk.getAccount();
        const erc20 = new Erc20Contract(token.contractAddress, token.chain);
        return await erc20.approve(spender, utils.toValue(1e18, 18))
    }

}

export const tokenService = new TokenService();