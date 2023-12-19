import * as React from 'react';
import {
    IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonText,
    IonCardContent, IonBadge, IonCardHeader,
    IonRow, IonCol, IonIcon, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonModal
} from '@ionic/react';
import {utils} from "../../common/utils";
import {CrossBill} from "../../types/cross";
import config from "../../common/config";
import {arrowForwardCircleOutline, close, ellipsisHorizontalOutline, linkOutline} from "ionicons/icons";
import {ChainType} from "@emit-technology/emit-lib";
import i18n from "../../locales/i18n";

interface Props{
    item: CrossBill
    onReceive:(strp:CrossBill)=>void;
}

export const BillList:React.FC<Props> = ({item,onReceive})=>{
    const v = item;
    const [showModal,setShowModal] = React.useState(false)
    const chainId = utils.sourceId2ChainType(item.DestinationId)
    return (<>
        <IonCard>
            <IonCardHeader>
                <IonCardTitle>
                    <IonRow>
                        <IonCol size="9">
                            <IonBadge color="light"><IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[ChainType.EMIT].description}
                                &nbsp;<IonIcon src={arrowForwardCircleOutline} className="icon-transform-3"/>&nbsp;
                                <IonIcon src={linkOutline} className="icon-transform-3"/>&nbsp;{config.chains[chainId].description}</IonBadge>
                        </IonCol>
                        <IonCol>
                            <div style={{float: "right"}}><IonIcon src={ellipsisHorizontalOutline} color="medium" onClick={()=>{
                                setShowModal(true)
                            }}/></div>
                        </IonCol>
                    </IonRow>
                </IonCardTitle>
                <IonCardSubtitle>
                    {utils.dateFormat(new Date(v.timestamp*1000))}
                </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
                <div  className="balance-span2">
                    <span style={{fontSize: '28px'}}><IonText color="primary">
                        +{utils.fromValue(v.amount,18).toString(10)}&nbsp;
                    </IonText></span>&nbsp;
                    <IonBadge>
                        {v.symbol}&nbsp;
                        <small style={{fontSize:"35%",letterSpacing:"0"}}>[{utils.ellipsisStr(v.erc20,4)}]</small>
                    </IonBadge>
                </div>

                <IonRow>
                    <IonCol offset="7" size="5">
                        <IonButton expand="block" size="small" onClick={() => {
                            setShowModal(false);
                            onReceive(v)
                        }}>{i18n.t("receive")}</IonButton>
                    </IonCol>
                </IonRow>
            </IonCardContent>
        </IonCard>

        <IonModal
            isOpen={showModal}
            initialBreakpoint={0.75}
            breakpoints={[0, 0.4, 0.75,1]}
            onDidDismiss={(e) => {
                setShowModal(false)
            }}>
            <IonPage >
                <IonHeader>
                    <IonToolbar color="white">
                        <IonTitle>
                            Detail
                        </IonTitle>
                        <IonIcon slot="end" icon={close} size="large" onClick={() => {
                            setShowModal(false)
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("from")} {i18n.t("chain")}</IonCol>
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
                                <IonCol size="4">{i18n.t("target")} {i18n.t("chain")}</IonCol>
                                <IonCol size="8">
                                    <IonBadge color="light" style={{padding: "6px 6px 12px"}}>
                                        <img style={{transform: "translateY(5px)"}} src={`./assets/img/chain/${ChainType.BSC}.png`} width={20}/>
                                        <span>{config.chains[ChainType.BSC].description}</span>
                                    </IonBadge>
                                </IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    {/*<IonItem>*/}
                    {/*    <IonLabel className="ion-text-wrap">*/}
                    {/*        <IonRow>*/}
                    {/*            <IonCol size="4">{i18n.t("txHash")}</IonCol>*/}
                    {/*            <IonCol size="8">{v.depositBlock && v.depositBlock.hash}</IonCol>*/}
                    {/*        </IonRow>*/}
                    {/*    </IonLabel>*/}
                    {/*</IonItem>*/}
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("receive")}</IonCol>
                                <IonCol size="8">{utils.toWeb3CheckAddress(item.recipient)}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("block")}</IonCol>
                                <IonCol size="8"><IonBadge>{item.depositBlock && item.depositBlock.block.num}</IonBadge></IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("timestamp")}</IonCol>
                                <IonCol size="8">{utils.dateFormat(new Date(item.timestamp*1000))}</IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                    {
                        v.depositBlock && <IonItem>
                            <IonLabel className="ion-text-wrap">
                                <IonRow>
                                    <IonCol size="4">Factor</IonCol>
                                    <IonCol size="8">
                                        <div  className="balance-span2">
                                            <span style={{fontSize: '28px'}}><IonText color="primary">+{utils.fromHexValue(v.depositBlock.block.factor_set.outs[0].factor.value).toString(10)}</IonText></span>&nbsp;
                                            <IonBadge>
                                                {utils.formatCategoryString(v.depositBlock.block.factor_set.outs[0].factor.category)}&nbsp;
                                                <small style={{
                                                    fontSize: "35%",
                                                    letterSpacing: "0"
                                                }}>[{utils.ellipsisStr(v.depositBlock.block.factor_set.outs[0].factor.category.supplier, 4)}]</small>
                                            </IonBadge>
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonLabel>
                        </IonItem>
                    }

                    <IonItem>
                        <IonLabel className="ion-text-wrap">
                            <IonRow>
                                <IonCol size="4">{i18n.t("status")}</IonCol>
                                <IonCol size="8">
                                <IonButton expand="block" onClick={()=>{
                                    setShowModal(false)
                                    onReceive(item)
                                }}>{i18n.t("receive")}</IonButton></IonCol>
                            </IonRow>
                        </IonLabel>
                    </IonItem>
                </IonContent>
            </IonPage>
        </IonModal>
    </>)
}