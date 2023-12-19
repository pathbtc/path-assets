import * as React from 'react';
import {NftStandard} from "../../types/nft";
import {NoneData} from "../Data/None";
import {IonRow, IonCol} from '@ionic/react';
import {NftItem} from "./Item";
import './Index.css';
import i18n from "../../locales/i18n";

interface Props {
    items: Array<NftStandard>;
    onClickItem?:(item:NftStandard)=>void;
    showCount?:boolean
}

export const NftList: React.FC<Props> = ({items,showCount,onClickItem}) => {
    return (<IonRow>
        {items && items.length > 0 ? <>
            {
                items.map((item,i)=>{
                    return <IonCol size="6" key={i} onClick={()=>{
                        onClickItem(item);
                    }}>
                                <NftItem item={item} count={showCount?1:0} showInfo/>
                        </IonCol>
                })
            }
        </> : <NoneData desc={i18n.t("noNftYet")}/>}
    </IonRow>)
}