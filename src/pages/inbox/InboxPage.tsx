import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonLoading,
    IonPage,
    IonTitle, IonToast,
    IonToolbar
} from "@ionic/react";
import {InboxList} from "../../components/Inbox/List";
import './index.css';
import {emitBoxSdk} from "../../service/emit";
import {AccountModel, ChainType} from '@emit-technology/emit-lib';
import {FactorSet, Settle, SettleResp} from "@emit-technology/emit-account-node-sdk";
import {CrossBill} from "../../types/cross";
import {crossBillService} from "../../service/cross/bill";
import {BillList} from "../../components/Inbox/BillList";
import {oRouter} from "../../common/roter";
import {NoneData} from "../../components/Data/None";
import {inboxService} from "../../service/inbox";
import i18n from "../../locales/i18n";

interface Props {
    router: HTMLIonRouterOutletElement | null;
    refresh: number
    onUpdate: (settles:number)=>void;
}

interface State {
    data: Array<any>
    showLoading: boolean,
    segment: string
    showToast: boolean,
    toastMsg: string,
    account?:AccountModel
}

export class InboxPage extends React.Component<Props, State> {
    state: State = {
        data: [],
        showLoading: false,
        segment: "unSettle",
        showToast: false,
        toastMsg: "",
    };

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh && window.location.hash.indexOf("#/tab/inbox")>-1) {
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {
        const data = await inboxService.listUnsettle();
        const account = await emitBoxSdk.getAccount()
        this.setState({
            data: data,
            account:account
        })
        this.props.onUpdate(data.length);
    }

    onReceive = async (settles: Array<SettleResp>) => {
        const account = await emitBoxSdk.getAccount();
        const sets: Array<Settle> = [];
        for (let settle of settles) {
            sets.push({
                from: settle.from_index_key.from,
                index: settle.from_index_key.index,
                num: settle.from_index_key.num,
                factor: settle.factor.factor,
            });
        }
        const factorSet: FactorSet = {
            settles: sets,
            outs: [],
        };
        const data = await emitBoxSdk.emitBox.emitDataNode.genPrepareBlock(
            account.addresses[ChainType.EMIT],
            [],
            factorSet,
            ""
        );
        // const sig = await accountService.emitBox.batchSignMsg([
        //     {chain:ChainType.EMIT,msg:data}
        // ])
        // console.log("debug:",sig)
        await emitBoxSdk.emitBox.emitDataNode.prepareBlock(data);

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.init().then(() => {
                    resolve(true)
                }).catch(e => {
                    reject(e)
                    console.error(e)
                })
            }, 3 * 1000)
        })
    }

    setShowLoading = (f: boolean) => {
        this.setState({
            showLoading: f
        })
    }

    onVote = async (bill: CrossBill) => {
        const rest = await crossBillService.commitVote(bill);
        oRouter.txInfo(rest.chain, rest.transactionHash, 0)
    }

    setShowToast = (f: boolean, msg?: string) => {
        this.setState({
            showToast: f,
            toastMsg: msg
        })
    }

    render() {
        const {showLoading, segment, data, showToast, toastMsg,account} = this.state;

        return (
            <IonPage>
                <IonHeader mode="ios" collapse="fade">
                    <IonToolbar>
                        <IonTitle className="ion-text-center">
                            {i18n.t("inbox")}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {
                        "unSettle" == segment && data && data.length > 0 ?
                        data.map((v, i) => {
                            if (v["timestamp"]) {
                                return <BillList key={i} item={v} onReceive={(v) => {
                                    this.setShowLoading(true)
                                    this.onVote(v).then(() => {
                                        this.setShowLoading(false)
                                    }).catch(e => {
                                        const err = typeof e == 'string' ? e : e.message;
                                        this.setShowToast(true, err)
                                        this.setShowLoading(false)
                                        console.error(e)
                                    })
                                }
                                }/>
                            } else if (v["factor"] && v["factor"]["timestamp"]) {
                                return <InboxList account={account} key={i} item={v} onReceive={(v) => {
                                    this.setShowLoading(true)
                                    this.onReceive([v]).then(() => {
                                        this.setShowLoading(false)
                                    }).catch(e => {
                                        this.setShowLoading(false)
                                        const err = typeof e == 'string' ? e : e.message;
                                        this.setShowToast(true, err)
                                        console.error(e)
                                    });
                                }}/>
                            }
                        }): "unSettle" == segment && <div className="inbox-no-data"><NoneData desc={i18n.t("noData")}/></div>
                    }

                    <IonLoading
                        cssClass='my-custom-class'
                        isOpen={showLoading}
                        onDidDismiss={() => this.setShowLoading(false)}
                        message={i18n.t("pending")}
                        duration={60 * 1000}
                    />
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