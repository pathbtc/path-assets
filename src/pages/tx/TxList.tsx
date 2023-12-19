import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonTitle,IonInfiniteScroll,IonInfiniteScrollContent,
    IonToolbar
} from '@ionic/react';
import {arrowBackOutline, arrowDownOutline, arrowUpOutline, openOutline, timeOutline} from "ionicons/icons";
import './index.css';
import {Token, TokenProtocol, TxResp} from "../../types";
import {AccountModel, ChainType} from '@emit-technology/emit-lib';
import {oRouter} from "../../common/roter";
import {emitBoxSdk} from "../../service/emit";
import {txService} from "../../service/tx";
import {tokenService} from "../../service/token";
import {NoneData} from "../../components/Data/None";
import {utils} from "../../common/utils";
import config from "../../common/config";
import i18n from "../../locales/i18n";

interface Props {
    refresh: number;
    chain: ChainType;
    symbol: string;
    tokenAddress:string
}

interface State {
    txs?: TxResp
    token?: Token
    segment: string
    pageSize: number
    pageNo: number
    account?:AccountModel
}

export class TxList extends React.Component<Props, State> {

    state: State = {
        segment: "activity",
        pageNo: 1,
        pageSize: 15
    }

    componentDidMount() {

        this.init().catch(e => {
            console.error(e)
        })
    }

    init = async () => {
        const {chain, symbol,tokenAddress} = this.props;
        const {pageSize} = this.state;
        const list = await txService.list(chain, symbol, 1, pageSize,tokenAddress);
        const token = await tokenService.getTokenBalance(chain, symbol,tokenAddress);
        const account = await emitBoxSdk.getAccount();
        this.setState({txs: list, token: token,account:account})
    }

    loadMore = async (event:any)=>{
        const {chain, symbol,tokenAddress} = this.props;
        const {pageNo,pageSize,txs} = this.state;
        const nextPage = pageNo + 1;
        const rest = await txService.list(chain, symbol,nextPage , pageSize,tokenAddress);
        rest.data = txs.data.concat(rest.data);

        if(rest && rest.total>0){
            if(rest.data.length == 0){
                event.target.disabled = true;
            }else{
                this.setState({
                    pageNo:nextPage,
                    txs:rest,
                })
            }
        }
        event.target.complete();
    }

    render() {
        const {chain, symbol,tokenAddress} = this.props;
        const {txs, token,segment,account} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon size="large" src={arrowBackOutline} onClick={() => {
                            oRouter.back();
                        }}/>
                        <IonTitle>{symbol}</IonTitle>
                        {
                            account && utils.isWeb3Chain(chain) && <IonIcon size="large" src={openOutline} slot="end" style={{paddingRight: "12px"}} onClick={()=>{
                                //@ts-ignore
                                window.open(config.chains[chain].explorer.address.format(account.addresses[chain]))
                            }}/>
                        }
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="token-tx-head">
                        <div className="token-icon">{
                            token && token.image? <img src={token.image}/>:<div>{token && token.protocol.toUpperCase()}</div>
                        }
                            <div style={{position:"absolute",bottom:"-8px",right:0}}>
                                <img src={`./assets/img/chain/${chain.valueOf()}.png`} width="15"/>
                            </div>
                        </div>
                        <div className="token-balance">{token ? utils.fromValue(token.balance,0).toString(10) : "0.000"}</div>
                    </div>
                    <IonSegment className="segment" mode="md" value={segment} onIonChange={(e)=>{
                        this.setState({segment:e.detail.value})
                    }}>
                        <IonSegmentButton className="seg-btn" mode="md" value="activity">
                            <IonLabel>{i18n.t("activity")}</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton className="seg-btn" mode="md" value="info">
                            <IonLabel>{i18n.t("intro")}</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    {
                        segment == "activity" &&
                        <div>
                            {
                                txs && txs.data && txs.data.length>0? txs.data.map((v,i) => {
                                    const amount = utils.fromValue(v.amount,token.decimal);
                                    let icon = arrowDownOutline;
                                    let text = i18n.t("receive");
                                    let prefix = "+"
                                    if(amount.toNumber()<=0){
                                        icon = arrowUpOutline;
                                        text = i18n.t("send")
                                        prefix = ""
                                    }
                                    return <IonItem key={i} onClick={() => {
                                        oRouter.txInfo(chain, v.txHash,v.num)
                                    }}>
                                        <IonAvatar slot="start" className="avatar">
                                            <IonIcon src={icon}/>
                                        </IonAvatar>
                                        <IonLabel>
                                            <div style={{padding: "6px 0"}}>
                                                <span className="token-tx-type">{text}</span>
                                            </div>
                                        </IonLabel>
                                        <IonLabel className="ion-text-wrap" slot="end">
                                            <div className="b-value">{prefix}{amount.toString(10)}</div>
                                            <p>{new Date(v.timestamp*1000).toLocaleString()}</p>
                                        </IonLabel>
                                    </IonItem>
                                }):<NoneData desc="No latest records"/>
                            }
                            <IonItem lines="none"></IonItem>
                            <IonItem lines="none"></IonItem>
                        </div>
                    }
                    {
                        segment == 'info' &&
                            <div>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("symbol")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.symbol}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("name")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.name}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("address")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.contractAddress}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("description")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && config.chains[token.chain].description}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("standard")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && TokenProtocol[token.protocol]}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start" position="fixed">{i18n.t("decimal")}</IonLabel>
                                    <IonLabel color="medium" className="ion-text-wrap">{token && token.decimal}</IonLabel>
                                </IonItem>
                                {
                                    token && token.totalSupply &&
                                    <IonItem>
                                        <IonLabel slot="start" position="fixed">{i18n.t("totalSupply")}</IonLabel>
                                        <IonLabel color="medium" className="ion-text-wrap">{token && utils.fromValue(token.totalSupply,token.decimal).toString(0)}</IonLabel>
                                    </IonItem>
                                }
                            </div>
                    }
                    <IonInfiniteScroll onIonInfinite={(e)=>this.loadMore(e)}>
                        <IonInfiniteScrollContent
                            loadingSpinner="bubbles"
                            loadingText="Loading more..."
                        >
                        </IonInfiniteScrollContent>
                    </IonInfiniteScroll>

                    <div className="token-tx-bt">
                        <IonRow>
                            <IonCol>
                                <IonButton expand="block" onClick={() => { oRouter.transferToken(chain, symbol,tokenAddress) }}>
                                    {i18n.t("send")}
                                </IonButton>
                            </IonCol>
                            <IonCol><IonButton expand="block" onClick={() => {
                                emitBoxSdk.getAccount().then(account => {
                                    oRouter.addressReceive(chain, symbol, account.addresses[chain])
                                })
                            }} fill="outline">{i18n.t("receive")}</IonButton></IonCol>
                        </IonRow>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}