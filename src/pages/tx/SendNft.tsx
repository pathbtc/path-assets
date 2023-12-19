import * as React from 'react';
import {IonPage, IonContent, IonHeader,IonChip,IonButton, IonText,IonTitle,IonInput,IonRow,IonCol,IonItemDivider, IonToolbar,IonItem,IonLabel,IonTextarea, IonIcon} from '@ionic/react';
import {arrowBackOutline, chevronBackOutline, chevronForwardOutline} from "ionicons/icons";
import './index.css';
import {oRouter} from "../../common/roter";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
interface Props {
    refresh: number;
    chain: ChainType;
    tokenId: string;
}

export class SendNftPage extends React.Component<Props, any> {

    componentDidMount() {

    }

    render() {
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>{
                            oRouter.back()
                        }}/>
                        <IonTitle>Transfer</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    <div className="nft-box2">
                        <IonRow>
                            <IonCol size="2"></IonCol>
                            <IonCol size="8">
                                <div className="nft-info2">
                                    <img  src={"https://wallet.emit.technology/assets/img/insignia.png"}/>
                                </div>
                            </IonCol>
                            <IonCol size="2"></IonCol>
                        </IonRow>
                    </div>
                    {/*<div className="nft-info2">*/}
                    {/*    <div className="nft-img">*/}
                    {/*        /!*<img style={{width:'60%'}} src={"https://wallet.emit.technology/assets/img/insignia.png"}/>*!/*/}
                    {/*        <img style={{width:'60%'}} src={"https://d3ky2du9j9kl06.cloudfront.net/images/bsc/0x9036b1c89fa26d90751cf42bbea626a5fd379b23/e88681050c99c2f551916f610b9056f9.png"}/>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <IonItem>
                        <IonLabel>Name</IonLabel>
                        <IonLabel className="ion-text-wrap" slot="end">
                            <IonText color="medium">EMIT AX #1187</IonText>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel>From</IonLabel>
                        <IonLabel className="ion-text-wrap">
                            <IonText color="medium">0x3f349bbafec1551819b8be1efea2fc46ca749aa1</IonText>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="none">
                        <IonLabel position="stacked">Receive Address</IonLabel>
                        <IonTextarea autoGrow clearOnEdit color="primary" autofocus className="input-addr"/>
                    </IonItem>
                    <IonItem lines="none" detail detailIcon={chevronForwardOutline}>
                        <IonLabel>Fee</IonLabel>
                        <IonLabel className="ion-text-wrap" slot="end">
                            <IonText color="medium">0.00000104 BNB</IonText>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="none"></IonItem>
                    <IonItem lines="none"></IonItem>
                    <div className="btn-bottom">
                        <IonButton expand="block" >Next step</IonButton>
                    </div>
                </IonContent>
            </IonPage>
        );
    }
}