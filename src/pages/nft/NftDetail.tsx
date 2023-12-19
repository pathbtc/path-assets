import * as React from 'react';
import {
    IonAvatar,
    IonButton,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import {arrowBackOutline, chevronBackOutline, linkOutline, scanCircleOutline} from "ionicons/icons";
import {nftService} from "../../service/nft";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';
import {NftStandard} from "../../types/nft";
import {NftInfo} from "../../components/Nft/Info";
import {oRouter} from "../../common/roter";

interface Props{
    refresh: number
    symbol:string;
    address:string;
    chain:ChainType;
    tokenId:any
}

interface State{
    nft?:NftStandard;
}
export class NftDetail extends React.Component<Props, State>{
    state:State = {};

    componentDidMount() {
        this.init().catch(e => {
            console.error(e)
        })
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<any>, snapshot?: any) {
        if (prevProps.refresh != this.props.refresh && window.location.hash.indexOf("#/nft")>-1) {
            this.init().catch(e => {
                console.error(e)
            })
        }
    }

    init = async () => {
        const {chain, symbol, address,tokenId} = this.props;
        const data = await nftService.info(chain, address, symbol,tokenId)
        this.setState({
            nft: data
        })
    }

    render() {
        const {nft} = this.state;
        return (
            <IonPage>
                <IonHeader mode="ios" >
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonIcon src={arrowBackOutline} slot="start" size="large" onClick={()=>{oRouter.back()}}/>
                            <IonBackButton text="buttonText" icon="buttonIcon" />
                        </IonButtons>
                        <IonTitle className="ion-text-center">
                            {nft && nft.name}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    {
                        nft && <NftInfo item={nft} onSend={()=>{
                        }
                        }/>
                    }
                </IonContent>
            </IonPage>
        );
    }
}