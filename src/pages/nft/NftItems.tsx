import * as React from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonModal, IonBackButton,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonAvatar, IonToolbar
} from "@ionic/react";
import {arrowBackOutline, chevronBackOutline, linkOutline, scanCircleOutline} from "ionicons/icons";
import {NftList} from "../../components/Nft/List";
import {oRouter} from "../../common/roter";
import {nftService} from "../../service/nft";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

interface Props {
    refresh: number;
    symbol:string;
    address:string;
    chain:ChainType
}

export class NftItems extends React.Component<Props, any> {

    state:any = {};

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
        const {chain,address,symbol} = this.props;
        const data = await nftService.items(chain, address, symbol)
        this.setState({
            nftData: data
        })
    }

    render() {
        const {symbol} = this.props;
        const {nftData} = this.state;
        return (
            <IonPage>
                <IonHeader mode="ios">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} slot="start" size="large" onClick={()=>{oRouter.back()}}/>
                        <IonTitle className="ion-text-center">{symbol}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    <NftList items={nftData} onClickItem={(item) => {
                        oRouter.nftDetail(item.chain, item.contract_address, item.symbol, item.token_id);
                    }}/>
                </IonContent>
            </IonPage>
        )
    }
}