import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonIcon,
    IonItem, IonRouterLink,
    IonLabel, IonBadge,
    IonPage,
    IonTitle,
    IonToolbar, IonToast
} from '@ionic/react';
import {
    arrowBackOutline,
    copyOutline,
} from "ionicons/icons";
import './index.css';
import {Token, TxDetail, TxResp} from "../../types";
import {ChainType} from '@emit-technology/emit-lib';
import {oRouter} from "../../common/roter";
import {QRCodeSVG} from 'qrcode.react';
import {utils} from "../../common/utils";
import {tokenService} from "../../service/token";
import config from "../../common/config";
import {emitBoxSdk} from "../../service/emit";
import {txService} from "../../service/tx";
import BigNumber from "bignumber.js";
import copy from "copy-to-clipboard";
import rpc, {TransactionReceipt} from "../../rpc";
import i18n from "../../locales/i18n";

interface Props {
    refresh: number;
    chain: ChainType;
    txHash: string;
    blockNum: null;
}

interface State {
    txDetail?: TxDetail
    showToast: boolean
    toastMsg: string
    txDisplay?: TxDisplay
    txReceipt?: TransactionReceipt
}

interface TxDisplay {
    from: string;
    to: Array<string>;
    amountWithCy: Array<AmountWithCy>;
    txHash: string;
    time: string;
    type: string;
    url: string;
    fee: string;
    gasLimit: string;
    gasPrice: string;
    num: number
}

interface AmountWithCy {
    amountDesc: any;
    token: Token
}

export class TxInfo extends React.Component<Props, State> {

    state: State = {showToast: false, toastMsg: ""}

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    _convertToTxDisplay = async (txDetail: TxDetail): Promise<TxDisplay> => {
        const account = await emitBoxSdk.getAccount();
        const {chain} = this.props;
        let type = "", amountWithCIES: Array<AmountWithCy> = [];

        const address = account.addresses[chain];
        const toAddress: Array<string> = [];
        if (txDetail.records) {
            //from
            {
                const records = txDetail.records.filter(v => {
                    if (v.address.toLowerCase() == address.toLowerCase()) {
                        return v
                    }
                })
                if (records && records.length > 0) {
                    for (let record of records) {
                        if (new BigNumber(record.amount).toNumber() == 0) {
                            continue
                        }
                        const token = await tokenService.info(chain, record.currency);
                        const value = utils.fromValue(record.amount, token.decimal);
                        const sym = value.toNumber() > 0 ? "+" : ""
                        amountWithCIES.push({
                            token: token,
                            amountDesc: <><IonBadge color="light">{utils.ellipsisStr(record.address)}</IonBadge>
                                <IonBadge color="primary">{`${sym}${value.toString(10)} ${record.currency}`}</IonBadge></>
                        })
                        type = value.toNumber() > 0 ? "Receive" : "Sent";
                    }
                }
            }
            //TO
            {
                const records = txDetail.records.filter(v => {
                    if (v.address.toLowerCase() != txDetail.fromAddress.toLowerCase()) {
                        return v
                    }
                })
                if (records && records.length > 0) {
                    for (let record of records) {
                        if (new BigNumber(record.amount).toNumber() == 0) {
                            continue
                        }
                        toAddress.push(record.address)
                    }
                }
            }
        }
        const toArr = [];
        for (let a of toAddress) {
            if (toArr.indexOf(a) == -1) {
                toArr.push(a)
            }
        }
        return {
            from: txDetail.fromAddress,
            to: toArr,
            amountWithCy: amountWithCIES,
            txHash: txDetail.txHash,
            time: utils.dateFormat(new Date(txDetail.timestamp * 1000)),
            type: type,
            num: txDetail.num,
            //@ts-ignore
            url: config.chains[chain].explorer.tx.format(txDetail.txHash),
            fee: `${utils.fromValue(txDetail.fee, 18).toString(10)} ${txDetail.feeCy}`,
            gasLimit: utils.fromValue(txDetail.gas, 0).toString(10),
            gasPrice: `${utils.fromValue(txDetail.gasPrice, 9).toString(10)} GWei`,
        }
    }

    init = async () => {
        const {chain, txHash, blockNum} = this.props;
        const txDetail = await txService.info(chain, txHash, blockNum)
        const txDisplay = await this._convertToTxDisplay(txDetail)
        let txReceipt;
        if (utils.isWeb3Chain(chain)) {
            txReceipt = await rpc.getTransactionReceipt(chain, txHash);
        }
        this.setState({
            txDetail: txDetail,
            txDisplay: txDisplay,
            txReceipt: txReceipt
        })
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }

    render() {
        const {txDetail, showToast, toastMsg, txDisplay, txReceipt} = this.state;
        const {chain} = this.props;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={() => {
                            oRouter.back();
                        }}/>
                        <IonTitle>{i18n.t("txDetail")}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {/*<div className="token-tx-head">*/}
                    {/*<div className="token-icon">*/}
                    {/*    <IonIcon src={checkmarkCircleOutline} size="large"/> <span className="token-tx-type">{txDisplay && txDisplay.type}</span>*/}
                    {/*</div>*/}
                    {/*<div className="token-balance">*/}
                    {/*    {*/}
                    {/*        txDisplay && txDisplay.amountWithCy.map((v, i) => {*/}
                    {/*            return <div key={i}>*/}
                    {/*                <TokenIcon token={v.token}/>{v.amountDesc}*/}
                    {/*            </div>*/}
                    {/*        })*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div>*/}
                    {/*    <IonText color="medium">{txDisplay && txDisplay.time}</IonText>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("txHash")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            <IonRouterLink onClick={() => {
                                if (utils.isWeb3Chain(chain)) {
                                    //@ts-ignore
                                    window.open(config.chains[chain].explorer.tx.format(txDisplay.txHash))
                                }
                            }}>{txDisplay && txDisplay.txHash}</IonRouterLink>
                            <IonIcon src={copyOutline} style={{transform: "translate(2px,5px)"}} size="small"
                                     onClick={() => {
                                         copy(txDisplay.txHash)
                                         copy(txDisplay.txHash)
                                         this.setShowToast(true, "Copied to clipboard!")
                                     }}/>
                        </div>
                    </IonItem>
                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("status")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            <IonBadge color="success">{i18n.t("success").toUpperCase()}</IonBadge>
                        </div>
                    </IonItem>

                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("block")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            <IonRouterLink onClick={() => {
                                if (utils.isWeb3Chain(chain)) {
                                    //@ts-ignore
                                    window.open(config.chains[chain].explorer.block.format(txDisplay.txHash))
                                }
                            }}>
                                <IonBadge color="primary">{txDisplay && txDisplay.num}</IonBadge>
                                <IonBadge color="light">{txReceipt && txReceipt.transactionIndex}</IonBadge>
                            </IonRouterLink>
                        </div>
                        <IonBadge color="light" slot="end" style={{padding: "6px 6px 12px"}}>
                            <img style={{transform: "translateY(5px)"}} src={`./assets/img/chain/${chain}.png`}
                                 width="20"/>
                            <span>
                                {config.chains[chain].description}
                            </span>
                        </IonBadge>
                    </IonItem>

                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("timestamp")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            {txDisplay && txDisplay.time}
                        </div>
                    </IonItem>


                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("from")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            <IonRouterLink onClick={()=>{
                                //@ts-ignore
                               window.open(config.chains[chain].explorer.address.format(txDisplay.from));
                            }}>
                                {txDisplay && txDisplay.from}
                            </IonRouterLink> &nbsp;
                            <IonIcon src={copyOutline} onClick={()=>{
                                copy(txDisplay && txDisplay.from)
                                copy(txDisplay && txDisplay.from)
                                this.setShowToast(true,"Copied to clipboard!")
                            }}/>
                        </div>
                    </IonItem>

                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("to")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal">
                            {
                                txDisplay && txDisplay.to.map((v, i) => {
                                    return <div key={i}>
                                        <IonRouterLink onClick={()=>{
                                            //@ts-ignore
                                            window.open(config.chains[chain].explorer.address.format(txDisplay.from));
                                        }}>
                                            {v}
                                        </IonRouterLink> &nbsp;
                                        <IonIcon src={copyOutline} onClick={()=>{
                                            copy(v)
                                            copy(v)
                                            this.setShowToast(true,"Copied to clipboard!")
                                        }}/>
                                    </div>
                                })
                            }
                        </div>
                    </IonItem>

                    <IonItem mode="ios">
                        <IonLabel color="dark" className="info-label"
                                  position="stacked">{i18n.t("value")}:</IonLabel>
                        <div className="text-small-x2 word-break text-padding-normal" style={{width: "100%"}}>
                            {
                                txDisplay && txDisplay.amountWithCy.map((v, i) => {
                                    return <div style={{width: "100%"}} key={i}>
                                        <b>{v.amountDesc}</b> &nbsp;
                                        {v.token.image ? <img src={v.token.image}
                                                              width={20}/> :
                                            <IonBadge color="light">{v.token.protocol.toUpperCase()}</IonBadge>}
                                    </div>
                                })
                            }
                        </div>
                    </IonItem>
                    {
                        txReceipt && utils.isWeb3Chain(chain) &&
                        <>
                            <IonItem mode="ios">
                                <IonLabel color="dark" className="info-label"
                                          position="stacked">{i18n.t("gasUsed")}:</IonLabel>
                                <div className="text-small-x2 word-break text-padding-normal" style={{width: "100%"}}>
                                    {
                                        `${txReceipt.gasUsed}(${new BigNumber(txReceipt.gasUsed).dividedBy(new BigNumber(txReceipt.cumulativeGasUsed)).multipliedBy(100).toFixed(2, 1)}%)`
                                    }
                                </div>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel color="dark" className="info-label"
                                          position="stacked">{i18n.t("gasLimit")}:</IonLabel>
                                <div className="text-small-x2 word-break text-padding-normal" style={{width: "100%"}}>
                                    {
                                        `${txReceipt.cumulativeGasUsed}`
                                    }
                                </div>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel color="dark" className="info-label"
                                          position="stacked">{i18n.t("transactionFee")}:</IonLabel>
                                <div className="text-small-x2 word-break text-padding-normal" style={{width: "100%"}}>
                                    {
                                        `${new BigNumber(txDetail.gasUsed).multipliedBy(txDetail.gasPrice).dividedBy(1e18).toFixed(8, 1)} ${txDetail.feeCy}`
                                    }
                                </div>
                            </IonItem>
                            <IonItem mode="ios">
                                <IonLabel color="dark" className="info-label"
                                          position="stacked">{i18n.t("gasPrice")}:</IonLabel>
                                <div className="text-small-x2 word-break text-padding-normal" style={{width: "100%"}}>
                                    {
                                        `${new BigNumber(txDetail.gasPrice).dividedBy(1e9).toString(10)} GWei`
                                    }
                                </div>
                            </IonItem>
                        </>
                    }

                    {
                        txDisplay && utils.isWeb3Chain(this.props.chain) && txDisplay.url &&
                        <div className="receive-qr" style={{background: "#fff"}}>
                            <div className="viewa" onClick={() => {
                                window.open(txDisplay.url)
                            }}>{i18n.t("viewTransaction")} &gt;</div>
                            <div className="qr-1">
                                <div>
                                    <QRCodeSVG value={txDisplay.url}
                                               size={100}/>

                                </div>
                            </div>
                        </div>
                    }
                    <IonToast
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={1500}
                        position="top"
                        color="primary"
                    />
                </IonContent>
            </IonPage>
        );
    }
}