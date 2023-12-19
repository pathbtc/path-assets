import * as React from 'react';
import {NftStandard} from "../../types/nft";
import {IonButton, IonCol, IonItem, IonItemDivider, IonLabel, IonRow} from '@ionic/react';
import {ChainType} from '@emit-technology/emit-lib';
import {oRouter} from "../../common/roter";

interface Props {
    item: NftStandard;
    onSend?:()=>void;
}

export const NftInfo: React.FC<Props> = ({item,onSend}) => {
    return (<>
        <div className="nft-info">
            <div className="img">
                <img src={item.meta.image}/>
            </div>
            {
                onSend && <div style={{margin: "0 0 12px"}}>
                    <IonButton expand="full" onClick={()=>{
                        oRouter.transferNft(ChainType.BSC, "1")
                    }}>Send</IonButton>
                </div>
            }
            <IonItemDivider sticky>Properties</IonItemDivider>
            <IonItem>
                <IonLabel className="ion-text-wrap" color="medium">
                    <IonRow>
                        {
                            item.meta.attributes.map((v,i)=>{
                                return <IonCol size="4">
                                    <div className="properties">
                                        <div>{v.trait_type}</div>
                                        <div>{v.value}</div>
                                    </div>
                                </IonCol>
                            })
                        }
                    </IonRow>
                </IonLabel>
            </IonItem>

            <IonItemDivider>About {item.symbol}</IonItemDivider>
            <IonItem>
                <IonLabel className="ion-text-wrap" color="medium"> {item.meta.description}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Contract</IonLabel>
                <IonLabel className="ion-text-wrap" color="medium">{item.contract_address}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Token Id</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.token_id}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Protocol</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.protocol}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Network</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{ChainType[item.chain]}</IonLabel>
            </IonItem>

            <IonItemDivider>About {item.symbol}</IonItemDivider>
            <IonItem>
                <IonLabel className="ion-text-wrap" color="medium"> {item.meta.description}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Contract</IonLabel>
                <IonLabel className="ion-text-wrap" color="medium">{item.contract_address}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Token Id</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.token_id}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Protocol</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.protocol}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Network</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{ChainType[item.chain]}</IonLabel>
            </IonItem>

            <IonItemDivider>About {item.symbol}</IonItemDivider>
            <IonItem>
                <IonLabel className="ion-text-wrap" color="medium"> {item.meta.description}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Contract</IonLabel>
                <IonLabel className="ion-text-wrap" color="medium">{item.contract_address}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Token Id</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.token_id}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Protocol</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{item.protocol}</IonLabel>
            </IonItem>
            <IonItem>
                <IonLabel>Network</IonLabel>
                <IonLabel className="ion-text-wrap ion-text-right" color="medium">{ChainType[item.chain]}</IonLabel>
            </IonItem>
        </div>
    </>)
}