import * as React from 'react';
import {IonPage, IonContent, IonIcon, IonHeader,IonToast, IonToolbar,IonText, IonTitle,IonRow,IonCol} from '@ionic/react';
import {arrowBackOutline, copyOutline, shareOutline} from "ionicons/icons";
import './index.css';
import {QRCodeSVG} from 'qrcode.react';
import {oRouter} from "../../common/roter";
import {ChainType} from '@emit-technology/emit-lib';
import copy from 'copy-to-clipboard';
import {tokenService} from "../../service/token";
import {TokenIcon} from "../../components/Tokens/TokenIcon";
import i18n from "../../locales/i18n";

interface Props {
    refresh: number;
    chain:ChainType;
    address:string;
    token:string;
}

export class Receive extends React.Component<Props, any> {
    state:any = {}
    setShowToast = (f:boolean,msg?:string) =>{
        this.setState({
            showToast:f,
            toastMsg: msg
        })
    }
    componentDidMount() {
        this.init().catch(e=>{console.error(e)})
    }

    init = async ()=>{
        const {chain,token,address} = this.props;

        const oToken = await tokenService.info(chain,token);

        this.setState({
            oToken:oToken
        })
    }
    render() {

        const {chain,address,token} = this.props;
        const {showToast ,toastMsg,oToken} = this.state;
        return (
            <IonPage>
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonIcon src={arrowBackOutline} size="large" onClick={()=>oRouter.back()}/>
                        <IonTitle>{i18n.t("receive")} {token}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen scrollY>
                    {oToken && <TokenIcon token={oToken}/>}
                    <div className="receive-qr">
                        <div>{i18n.t("scanTips")}</div>
                        <div className="qr-1">
                            <div>
                                <QRCodeSVG value={address} size={200} />
                            </div>
                        </div>
                        {/*<div style={{padding: "0 0 12px"}}>*/}
                        {/*    <img src={`./assets/img/chain/${chain}.png`} width={30} style={{transform: "translateY(8px)"}}/>*/}
                        {/*    &nbsp;{config.chains[chain].description}*/}
                        {/*</div>*/}
                    </div>
                    <div className="ion-text-center" style={{padding:"0 24px"}}>
                        <p><small><IonText color="medium">{i18n.t("receive")} {i18n.t("address")}</IonText></small></p>
                        <p><b><IonText color="medium">{address}</IonText></b></p>
                    </div>
                    <div className="qr-btn" onClick={()=>{
                        copy(address);
                        copy(address);
                        this.setShowToast(true,i18n.t("copied"))
                    }}>
                        <p><IonText color="medium"><IonIcon src={copyOutline} style={{transform: "translateY(3px)"}} /> {i18n.t("copy")}</IonText></p>
                    </div>

                    <IonToast
                        color="primary"
                        position="top"
                        isOpen={showToast}
                        onDidDismiss={() => this.setShowToast(false)}
                        message={toastMsg}
                        duration={1500}
                    />
                </IonContent>
            </IonPage>
        );
    }
}