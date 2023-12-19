import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader, IonToast,
    IonIcon,
    IonLabel,
    IonModal,
    IonPage, IonLoading,
    IonRow,
    IonSegment, IonText,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import './Home.css';
import {AccountModel} from "@emit-technology/emit-lib";
import {
    arrowDownCircleOutline,
    arrowUpCircleOutline, chevronDownOutline,
    linkOutline, optionsOutline, personOutline,
    scanCircleOutline
} from "ionicons/icons";
import {NftList} from "../components/Nft/List";
import {oRouter} from "../common/roter";
import {NftStandard, Token} from "../types";
import {TokenList} from "../components/Tokens/List";
import {tokenService} from "../service/token";
import {TokenListModal} from "../components/Tokens/ListModal";
import {emitBoxSdk} from "../service/emit";
import {utils} from "../common/utils";
import config from "../common/config";
import {interVarBalance} from "../common/interVal";
import {inboxService} from "../service/inbox";
import i18n from "../locales/i18n";

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number
    onUpdate: (settles:number)=>void;
}

interface State {
    nftData: Array<NftStandard>;
    tab: string;
    showModal: boolean;
    tokens: Array<Token>;
    modal: string;
    addr: string;
    account?: AccountModel;
    allTokens: Array<Token>;
    showLoading: boolean;
    showToast: boolean;
    toastMsg?: string
}

export class Home extends React.Component<Props, State> {

    state: State = {
        tab: "tokens",
        nftData: config.recommendNfts,
        showModal: false,
        tokens: config.recommendTokens,
        modal: "",
        addr: "",
        allTokens: [],
        showLoading: false,
        showToast: false
    }

    setTab = (v: string) => {
        this.setState({
            tab: v
        })
    }

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
        emitBoxSdk.emitBox.onActiveAccountChanged((account) => {
            emitBoxSdk.setAccount(account).catch(e => console.error(e))
            this.setState({
                account: account
            })
            this.initBalance(account).catch(e => console.error(e));
        })

        //auto fetch balance;
        interVarBalance.start(() => {
            this.initBalance().catch(e => console.error(e))
        }, 5 * 1000, true)
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh && window.location.hash == "#/tab/home") {
            this.init().catch(e => console.error(e));
        }
    }

    init = async () => {
        const account = await emitBoxSdk.getAccount();
        await this.initBalance(account);
        const tks = await tokenService.list(true);
        this.setState({
            allTokens: tks
        })
        inboxService.listUnsettle().then(data=>{
            this.props.onUpdate(data.length)
        }).catch(e=>{console.error(e)})

    }

    initBalance = async (act?: AccountModel) => {
        const {account} = this.state;
        if (!act) {
            act = account;
        }
        if (act && act.name) {
            const tokensCache = await tokenService.getTokenWithBalance(act);
            this.setState({tokens: tokensCache, account: act});

            tokenService.getBalanceRemote(act).then(token => {
                this.setState({tokens: token});
            }).catch(e=>{console.error(e)});
        }
    }

    setShowModal = (f: boolean, modal: string) => {
        this.setState({
            showModal: f,
            modal: modal
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    requestAccount = async () => {
        const account = await emitBoxSdk.getAccount();
        const rest = await emitBoxSdk.emitBox.requestAccount(account && account.accountId)
        if(rest.error){
            // this.setShowToast(true,rest.error)
        }else{
            await emitBoxSdk.setAccount(rest.result);
            this.setState({
                account: rest.result,
            })
            this.setShowLoading(true);
            await this.init();
        }
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }

    addCustomerToken = async (v:Token) =>{
        await tokenService.addToken(v)
        await this.init();
        this.setShowModal(false, "");
    }

    render() {
        const {tab, nftData, showModal, tokens, showToast, toastMsg, showLoading, modal, allTokens, addr, account} = this.state;
        const {router} = this.props;
        return (
            <IonPage>
                <IonHeader mode="ios" collapse="fade">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton fill="solid" color="light" mode="ios" style={{margin: "12px"}} onClick={() => {
                                // accountService.showWidget();
                                // accountService.ethWeb3.eth.getAccounts((err,accounts)=>{
                                //     console.log(err,accounts)
                                // })
                                this.requestAccount().then(() => {
                                    this.setShowLoading(false)
                                }).catch(e => {
                                    console.error(e)
                                    this.setShowLoading(false)
                                });
                            }}>
                                <IonIcon slot="start" icon={personOutline}/>{account && account.name ? account.name : "Select Account"}
                                <IonIcon slot="end" icon={chevronDownOutline}/>
                            </IonButton>
                        </IonButtons>
                        <IonTitle className="ion-text-center" onClick={() => {

                        }}>
                            EMIT-Assets
                            <div><small><IonText color="medium">{addr && utils.ellipsisStr(addr)}</IonText></small>
                            </div>
                        </IonTitle>
                        {/*<IonButtons slot="end">*/}
                        {/*    <IonAvatar className="avatar" style={{margin: "0 12px 0 0"}}>*/}
                        {/*        <IonIcon src={scanCircleOutline} size="large"/>*/}
                        {/*    </IonAvatar>*/}
                        {/*</IonButtons>*/}
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {/*box*/}
                    <div className="page-inner">
                        {/*head*/}
                        <div className="header">
                            <IonRow>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "send")
                                        }}>
                                            <IonIcon src={arrowUpCircleOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "receive")
                                        }}>
                                            <IonIcon src={arrowDownCircleOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                                <IonCol className="avatar-item">
                                    <div>
                                        <IonAvatar className="avatar" onClick={() => {
                                            this.setShowModal(true, "add")
                                        }}>
                                            <IonIcon src={optionsOutline} size="large"/>
                                        </IonAvatar>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </div>
                        <div className="content">
                            <div style={{position: 'sticky', top: 0, background: "#fff", zIndex: "1000"}}>
                                <IonSegment className="segment" mode="md" value={tab}
                                            onIonChange={e => {
                                                this.setTab(e.detail.value)
                                            }}>
                                    <IonSegmentButton className="seg-btn" mode="md" value="tokens">
                                        <IonLabel>{i18n.t("tokens")}</IonLabel>
                                    </IonSegmentButton>
                                    <IonSegmentButton className="seg-btn" mode="md" value="nfts">
                                        <IonLabel>{i18n.t("nfts")}</IonLabel>
                                    </IonSegmentButton>
                                </IonSegment>
                            </div>
                            {
                                tab == "tokens" ?
                                    <div>
                                        <TokenList tokens={tokens} onSelect={(v) => {
                                            oRouter.txList(v.chain, v.symbol,v.contractAddress)
                                        }}/>

                                    </div> :
                                    <div>
                                        <NftList showCount items={nftData} onClickItem={(item) => {
                                            if (item) {
                                                oRouter.nftItems(item.chain, item.contract_address, item.symbol);
                                            }
                                        }}/>
                                    </div>
                            }
                        </div>
                        <div>
                            <IonModal
                                isOpen={showModal}
                                swipeToClose={true}
                                presentingElement={router || undefined}
                                onDidDismiss={() => {
                                    this.initBalance().catch(e => console.error(e))
                                    this.setShowModal(false, "")
                                }}>
                                <div>
                                    <TokenListModal tokens={modal == 'add' ? allTokens : tokens}
                                                    title={modal == 'add' ? i18n.t("addToken") : i18n.t("selectToken")}
                                                    onClose={() => {
                                                        this.initBalance().catch(e => console.error(e))
                                                        this.setShowModal(false, "");
                                                    }}
                                                    onSend={modal == 'send' ? (token) => {
                                                        this.setShowModal(false, "");
                                                        oRouter.transferToken(token.chain, token.symbol,token.contractAddress)
                                                    } : undefined}
                                                    onReceive={modal == 'receive' ? (token) => {
                                                        this.setShowModal(false, "");
                                                        oRouter.addressReceive(token.chain, token.symbol, account.addresses[token.chain])
                                                    } : undefined}
                                                    onHide={modal == 'add' ? (hide, token) => {
                                                        tokenService.hide(hide, token)
                                                    } : undefined}
                                                    onAddToken={modal == 'add'? (v)=>{
                                                        this.addCustomerToken(v).catch(e=>{console.error(e)})
                                                    }:undefined}
                                                    doReorder={(event) => {
                                        const sortItems = event.detail.complete(allTokens);
                                        tokenService.setSortNum(sortItems);
                                        this.setState({
                                            allTokens: sortItems
                                        })
                                    }}/>

                                </div>
                                <IonButton onClick={() => this.setShowModal(false, "")}>{i18n.t("close")}</IonButton>
                            </IonModal>
                        </div>
                        <div className="footer">

                        </div>
                    </div>
                </IonContent>
                <IonLoading
                    cssClass='my-custom-class'
                    isOpen={showLoading}
                    onDidDismiss={() => this.setShowLoading(false)}
                    message={'Loading balance...'}
                    duration={60 * 1000}
                />

                <IonToast
                    position="top"
                    color="primary"
                    isOpen={showToast}
                    onDidDismiss={() => this.setShowToast(false)}
                    message={toastMsg}
                    duration={1500}
                />

            </IonPage>
        );
    }


}

export default Home;
