import * as React from 'react';
import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRouterLink,
    IonRow,
    IonText,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {utils} from "../../common/utils";
import {arrowForwardCircleOutline, close, ellipsisHorizontalOutline, linkOutline} from "ionicons/icons";
import config from "../../common/config";
import {AccountModel, ChainType, SettleResp} from "@emit-technology/emit-lib";
import i18n from '../../locales/i18n';
import {CrossData} from "../../types/cross";

interface Props {
    item: SettleResp
    onReceive: (SettleResp) => void;
    account?:AccountModel
}

export const InboxList: React.FC<Props> = ({item,account, onReceive}) => {
    const v = item;
    const [showModal,setShowModal] = React.useState(false)

    let crossData:CrossData;
    if(v.factor && v.factor["data"]){
        try{
            crossData = JSON.parse(Buffer.from(v.factor["data"],"hex").toString());
        }catch (e){console.log(e)}
    }

    let originChain = crossData && crossData.sourceId?crossData.sourceId:ChainType.EMIT;
    if(originChain == 1){
        originChain = ChainType.ETH
    }
    // console.log("item:::",crossData, item);
    return (<>
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    <IonRow>
                        <IonCol size="9">
                            <IonBadge color="light">
                                <IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[originChain].description}
                                &nbsp;<IonIcon src={arrowForwardCircleOutline} className="icon-transform-3"/>&nbsp;
                                <IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[ChainType.EMIT].description}</IonBadge>
                        </IonCol>
                        <IonCol>
                            <div style={{float: "right"}}><IonIcon src={ellipsisHorizontalOutline} color="medium" onClick={()=>{
                                setShowModal(true)
                            }}/></div>
                        </IonCol>
                    </IonRow>
                </IonCardTitle>
                <IonCardSubtitle>
                    {utils.dateFormat(new Date(v.factor.timestamp ))}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <div  className="balance-span2">
                    <span style={{fontSize: '28px'}}><IonText color="primary">+{utils.fromHexValue(v.factor.factor.value).toString(10)}</IonText></span>&nbsp;
                    <IonBadge>
                        {utils.formatCategoryString(v.factor.factor.category)}&nbsp;
                        <small style={{
                            fontSize: "35%",
                            letterSpacing: "0"
                        }}>[{utils.ellipsisStr(v.factor.factor.category.supplier, 4)}]</small>
                    </IonBadge>
                </div>

                {
                    !v.settled && <IonRow>
                        <IonCol offset="7" size="5">
                            <IonButton expand="block" size="small" onClick={() => {
                                setShowModal(false);
                                onReceive(v)
                            }}>{i18n.t("receive")}</IonButton>
                        </IonCol>
                    </IonRow>
                }
                {
                    v.settled && <IonRow>
                        <IonCol offset="7" size="5">
                            <IonBadge color="medium">Settled</IonBadge>
                        </IonCol>
                    </IonRow>
                }

            </IonCardContent>

        </IonCard>

        <IonModal
            isOpen={showModal}
            initialBreakpoint={0.75}
            breakpoints={[0, 0.4,0.75, 1]}
            onDidDismiss={(e) => {
               setShowModal(false)
            }}>
            <IonPage >
                <IonHeader>
                    <IonToolbar color="white">
                        <IonTitle>
                            {i18n.t("detail")}
                        </IonTitle>
                        <IonIcon slot="end" icon={close} size="large" onClick={() => {
                            setShowModal(false)
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent>

                    {
                        crossData && crossData.txHash && <>
                            <IonItem>
                                <IonLabel className="ion-text-wrap">
                                    <IonRow>
                                        <IonCol size="4">{i18n.t("from")} {i18n.t("chain")}</IonCol>
                                        <IonCol size="8">
                                            <IonBadge color="light" style={{padding: "6px 6px 12px"}}>
                                                <img style={{transform: "translateY(5px)"}} src={`./assets/img/chain/${originChain}.png`} width={20}/>
                                                <span>{config.chains[originChain].description}</span>
                                            </IonBadge>
                                        </IonCol>
                                    </IonRow>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel className="ion-text-wrap">
                                    <IonRow>
                                        <IonCol size="4">{i18n.t("target")} {i18n.t("chain")}</IonCol>
                                        <IonCol size="8">
                                            <IonBadge color="light" style={{padding: "6px 6px 12px"}}>
                                                <img style={{transform: "translateY(5px)"}} src={`./assets/img/chain/${ChainType.EMIT}.png`} width={20}/>
                                                <span>{config.chains[ChainType.EMIT].description}</span>
                                            </IonBadge>
                                        </IonCol>
                                    </IonRow>
                                </IonLabel>
                            </IonItem>
                            <IonItem>
                                <IonLabel className="ion-text-wrap">
                                    <IonRow>
                                        <IonCol size="4">{i18n.t("txHash")}</IonCol>
                                        <IonCol size="8">
                                            <IonRouterLink onClick={()=>{
                                                //@ts-ignore
                                                window.open(config.chains[originChain].explorer.tx.format(crossData.txHash))
                                            }}>
                                                {crossData.txHash}
                                            </IonRouterLink>
                                        </IonCol>
                                    </IonRow>
                                </IonLabel>
                            </IonItem>
                        </>
                    }

                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("from")}</IonCol>
                                <IonCol size="8">
                                    {
                                        crossData && crossData.sender && <IonBadge color="light" className="icon-transform-3">{account && account.addresses[originChain].toLowerCase().indexOf(crossData && crossData.sender.toLowerCase())>-1 && account.name}</IonBadge>
                                    }
                                    &nbsp;{crossData && crossData.sender? `0x${crossData.sender}`:item.from_index_key.from}
                                </IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("block")}</IonCol>
                                <IonCol size="8"><IonBadge>{item.from_index_key.num}</IonBadge></IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("timestamp")}</IonCol>
                                <IonCol size="8">{utils.dateFormat(new Date(item.factor.timestamp))}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">Factor</IonCol>
                                <IonCol size="8">
                                    <div  className="balance-span2">
                                        <span style={{fontSize: '28px'}}><IonText color="primary">+{utils.fromHexValue(v.factor.factor.value).toString(10)}</IonText></span>&nbsp;
                                        <IonBadge>
                                            {utils.formatCategoryString(v.factor.factor.category)}&nbsp;
                                            <small style={{
                                                fontSize: "35%",
                                                letterSpacing: "0"
                                            }}>[{utils.ellipsisStr(v.factor.factor.category.supplier, 4)}]</small>
                                        </IonBadge>
                                    </div>
                                </IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("status")}</IonCol>
                                <IonCol size="8">{item.settled?<IonBadge color="success">Settled</IonBadge>:<IonButton expand="block" onClick={()=>{
                                    setShowModal(false)
                                    onReceive(item)
                                }}>{i18n.t("receive")}</IonButton>}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        </IonModal>
    </>)
}