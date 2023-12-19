import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {IonApp, IonRouterOutlet,IonButton,IonItem,IonCheckbox,
    IonModal, IonHeader, IonContent, IonToolbar, IonTitle, setupIonicReact,IonTabs,IonTabBar,IonLabel,IonTabButton,IonIcon,IonBadge,
} from '@ionic/react';
import {IonReactHashRouter} from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {wallet, apps, settings, walletOutline, settingsOutline, appsOutline, cubeOutline} from "ionicons/icons";
import {NftItems} from "./pages/nft/NftItems";
import {NftDetail} from "./pages/nft/NftDetail";
import {InboxPage} from "./pages/inbox/InboxPage";
import {Receive} from "./pages/address/Receive";
import {SendPage} from "./pages/tx/Send";
import {TxList} from "./pages/tx/TxList";
import {TxInfo} from "./pages/tx/TxInfo";
import {SendNftPage} from "./pages/tx/SendNft";
import {Settings} from "./pages/settings/Settings";
import i18n from './locales/i18n'
import {utils} from "./common/utils";
import selfStorage from "./common/storage";

setupIonicReact({
    mode: "ios"
});
const App: React.FC = () => {
    const routerRef = useRef<HTMLIonRouterOutletElement | null>(null);
    const [unSettleNum,setUnSettle] = useState(0)
    const [freshNum,setFreshNum] = useState(0)
    const [checked,setChecked] = useState(false);
    const isNotChrome = !utils.isChrome() && !selfStorage.getItem("neverRemind");

    useEffect(()=>{
        const neverRemind = selfStorage.getItem("neverRemind")
        setChecked(!!neverRemind)
    },[])
    return (
        <div className={`page`}>
            <div className="page-inner">
                <IonApp>
                    <IonReactHashRouter>
                        <Switch>
                            <Route exact path="/nft/:chain/:symbol/:address" component={(props)=>{
                                return <NftItems refresh={Math.floor(Date.now()/1000)}
                                                 address={props.match.params.address}
                                                 symbol={props.match.params.symbol}
                                                 chain={props.match.params.chain}
                                />

                            } }/>
                            <Route exact path="/nft/:chain/:symbol/:address/:tokenId" component={(props)=>{
                                return <NftDetail refresh={Math.floor(Date.now()/1000)}
                                                  address={props.match.params.address}
                                                  symbol={props.match.params.symbol}
                                                  chain={props.match.params.chain}
                                                  tokenId={props.match.params.tokenId}
                                />
                            } }/>
                            <Route exact path="/address/receive/:chain/:address/:token" component={(props)=>{
                                return <Receive refresh={Math.floor(Date.now()/1000)}
                                                chain={props.match.params.chain}
                                                address={props.match.params.address}
                                                token={props.match.params.token}/>
                            } }/>
                            <Route exact path="/send/token/:chain/:symbol/:tokenAddress" component={(props)=>{
                                return <SendPage refresh={Math.floor(Date.now()/1000)}
                                                 chain={props.match.params.chain}
                                                 symbol={props.match.params.symbol}
                                                 tokenAddress={props.match.params.tokenAddress}
                                />
                            } }/>
                            <Route exact path="/send/nft/:chain/:tokenId" component={(props)=>{
                                return <SendNftPage refresh={Math.floor(Date.now()/1000)}
                                                 chain={props.match.params.chain}
                                                 tokenId={props.match.params.tokenId}/>
                            } }/>
                            <Route exact path="/tx/list/:chain/:symbol/:tokenAddress" component={(props)=>{
                                return <TxList refresh={Math.floor(Date.now()/1000)}
                                               chain={props.match.params.chain}
                                               symbol={props.match.params.symbol}
                                               tokenAddress={props.match.params.tokenAddress}
                                />
                            } }/>
                            <Route exact path="/tx/info/:chain/:txHash/:blockNum" component={(props)=>{
                                return <TxInfo refresh={Math.floor(Date.now()/1000)}
                                               chain={props.match.params.chain}
                                               txHash={props.match.params.txHash}
                                               blockNum={props.match.params.blockNum}
                                />
                            } }/>
                            <Route exact path="/">
                                <Redirect to="/tab/home"/>
                            </Route>
                            <Route path="/tab" render={(props)=>{
                                return <IonTabs >
                                    <IonRouterOutlet ref={routerRef}>
                                        <Switch>
                                        <Route exact path="/tab/home" render={()=><Home  onUpdate={(n)=>{
                                            setUnSettle(n)
                                        }} refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>}/>
                                        <Route exact path="/tab/inbox" render={()=><InboxPage onUpdate={(n)=>{
                                            setUnSettle(n)
                                        }} refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>} />
                                        <Route exact path="/tab/settings" render={()=><Settings onRefresh={()=>{
                                            setFreshNum(freshNum+1)
                                        }} refresh={Math.floor(Date.now()/1000)} router={routerRef.current}/>}/>
                                        </Switch>
                                    </IonRouterOutlet>
                                    <IonTabBar slot="bottom" style={{minHeight:"70px"}} selectedTab="assets">
                                        <IonTabButton tab="assets" href="/tab/home">
                                            <IonIcon icon={walletOutline} />
                                            <IonLabel>{i18n.t("assets")}</IonLabel>
                                        </IonTabButton>

                                        <IonTabButton tab="inbox" href="/tab/inbox">
                                            <IonIcon icon={cubeOutline} />
                                            <IonLabel>{i18n.t("inbox")}</IonLabel>
                                            {unSettleNum>0 && <IonBadge color="danger">{unSettleNum}</IonBadge>}
                                        </IonTabButton>

                                        <IonTabButton tab="settings" href="/tab/settings">
                                            <IonIcon icon={settingsOutline} />
                                            <IonLabel>{i18n.t("settings")}</IonLabel>
                                        </IonTabButton>
                                    </IonTabBar>
                                </IonTabs>
                            }}>
                            </Route>
                        </Switch>
                    </IonReactHashRouter>
                    <IonModal isOpen={isNotChrome} className="ndcr">
                        <IonHeader collapse="fade">
                            <IonToolbar>
                                <IonTitle>EMIT Notification</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent className="ion-padding">
                            <IonItem lines="none">
                                <IonLabel>
                                    EMIT-Assets works best on Chrome browser.
                                </IonLabel>
                            </IonItem>
                            <IonItem lines="none">
                                <IonCheckbox slot="start" onIonChange={(e)=>{
                                    setChecked(e.detail.checked)
                                }}/>
                                <IonLabel>Never remind again</IonLabel>
                            </IonItem>
                            <IonButton expand="block" onClick={()=>{
                                selfStorage.setItem("neverRemind",checked)
                                setFreshNum(Date.now)
                                window.open("https://www.google.com/chrome/")
                            }}>Click to download Chrome browser</IonButton>
                        </IonContent>
                    </IonModal>
                </IonApp>
            </div>
        </div>
    );
}

export default App;
