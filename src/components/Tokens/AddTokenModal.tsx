import * as React from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonPage,
    IonRadio,
    IonRadioGroup,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {arrowBackOutline} from "ionicons/icons";
import config from "../../common/config";
import {ChainType} from '@emit-technology/emit-lib'
import {Token, TokenProtocol} from "../../types";
import Erc20Contract from "../../contract/erc20/eth";
import * as web3Utils from 'web3-utils';

interface Props {
    onClose: ()=>void;
    onOk:(token:Token)=>void;
}
export const AddTokenModal:React.FC<Props> = ({onClose,onOk})=>{

    const [chain,setChain] = React.useState(ChainType.ETH);
    const [name,setName] = React.useState("");
    const [symbol,setSymbol] = React.useState("");
    const [address,setAddress] = React.useState("");
    const [decimal,setDecimal] = React.useState("");

    return <>
        <IonPage>
            <IonHeader mode="ios" collapse="fade">
                <IonToolbar>
                    <IonTitle className="ion-text-center">Add Token</IonTitle>
                    <IonButtons slot="start">
                        <IonIcon src={arrowBackOutline} size="large" onClick={() => {
                            onClose()
                        }}/>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen scrollY>
                <IonItemDivider>Select Chain</IonItemDivider>
                <IonRadioGroup value={chain} onIonChange={(e)=>{
                    setChain(e.detail.value);
                }}>
                    {
                        [ChainType.ETH,ChainType.BSC].map((v,i)=>{
                            return <IonItem key={i}>
                                <IonLabel>{config.chains[v].description}</IonLabel>
                                <IonRadio value={v} />
                            </IonItem>
                        })
                    }
                </IonRadioGroup>
                <IonItemDivider>Token</IonItemDivider>
                <IonItem>
                    <IonLabel position="stacked">Address</IonLabel>
                    <IonInput placeholder="Token address"  onIonChange={(e)=>{
                        const addr = e.detail.value;
                        setAddress(addr);
                        if(addr && web3Utils.isAddress(addr)){
                            const token = new Erc20Contract(addr,chain);
                            token.name().then((v)=>{
                                setName(v)
                            }).catch((e)=>console.log("not standard erc20 token"))
                            token.symbol().then((v)=>{
                                setSymbol(v)
                            }).catch((e)=>console.log("not standard erc20 token"))
                            token.decimals().then((v)=>{
                                setDecimal(v.toString(10))
                            }).catch((e)=>console.log("not standard erc20 token"))
                        }

                    }}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Symbol</IonLabel>
                    <IonInput disabled value={symbol} onIonChange={(e)=>{
                        setSymbol(e.detail.value);
                    }}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Name</IonLabel>
                    <IonInput disabled value={name}  onIonChange={(e)=>{
                        setName(e.detail.value);
                    }}/>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Decimal</IonLabel>
                    <IonInput disabled value={decimal} placeholder="18" onIonChange={(e)=>{
                        setDecimal(e.detail.value);
                    }}/>
                </IonItem>

                <div className="btn-bottom">
                    <IonButton expand="block" onClick={()=>{
                        const token:Token = {
                            name: name,
                            symbol: symbol,
                            decimal: decimal?parseInt(decimal):18,
                            // totalSupply?: string;
                            contractAddress: address,
                            // image?: string;
                            protocol: chain == ChainType.ETH?TokenProtocol.ERC20:TokenProtocol.BEP20,
                            chain: chain,
                            feeCy: chain == ChainType.ETH?"ETH":"BNB",
                        }
                        onOk(token);
                    }}>
                        Ok
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    </>
}