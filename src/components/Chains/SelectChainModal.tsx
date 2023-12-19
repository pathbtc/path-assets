import * as React from 'react';
import {CrossToken} from "../../types/cross";
import {ChainType} from '@emit-technology/emit-lib';
import {IonPage,IonText,IonModal,IonHeader,IonItem,IonAvatar,IonLabel,IonToolbar,IonTitle,IonIcon,IonContent} from '@ionic/react'
import {close, linkOutline} from "ionicons/icons";
import {utils} from "../../common/utils";
import config from "../../common/config";
interface Props {
    isOpen: boolean;
    crossToken: CrossToken
    onCancel?: () => void;
    onOk?: (targetChain: ChainType) => void;
}

export const SelectChainModal: React.FC<Props> = ({isOpen, onOk, onCancel,crossToken}) => {
    const tokens = Object.keys(crossToken);
    return (<>
        <IonModal
            isOpen={isOpen}
            initialBreakpoint={0.5}
            breakpoints={[0, 0.5, 1]}
            onDidDismiss={(e) => {
                onCancel()
            }}>
            <IonPage>
                <IonHeader>
                    <IonToolbar color="white">
                        <IonTitle>
                            Select chain
                        </IonTitle>
                        <IonIcon slot="end" icon={close} size="large" onClick={() => {
                            onCancel()
                        }}/>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    {
                        tokens.map((chainName,i)=>{
                            const t = crossToken[chainName];
                            const chainId = utils.getChainByName(chainName);
                            return <IonItem key={i} onClick={()=>{
                                onOk(chainId)
                            }}>
                                <IonAvatar slot="start">
                                    {/*<IonIcon src={linkOutline} size="large" className="icon-transform"/>*/}
                                    <img src={`./assets/img/chain/${chainId}.png`}/>
                                </IonAvatar>
                                <IonLabel className="ion-text-wrap">
                                    <b>{config.chains[chainId].description}</b>
                                </IonLabel>
                            </IonItem>
                        })
                    }
                </IonContent>
            </IonPage>
        </IonModal>
    </>)
}