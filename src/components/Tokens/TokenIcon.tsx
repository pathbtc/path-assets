import * as React from 'react';
import {Token} from "../../types";
import {IonAvatar, IonTitle} from "@ionic/react";

interface Props {
    token: Token;
    width ?:number
}
export const TokenIcon:React.FC<Props> = ({token,width}) =>{
    return <div className="flex-center">
        <IonAvatar className="avatar">
            {token.image ? <img src={token.image} width={width?width:20}/> : <div>{token.protocol.toUpperCase()}</div>}
            <div style={{position:"absolute",bottom:"-8px",right:0}}>
                <img src={`./assets/img/chain/${token.chain.valueOf()}.png`} width="15"/>
            </div>
        </IonAvatar>
    </div>
}