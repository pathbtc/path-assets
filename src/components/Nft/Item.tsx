import * as React from 'react';
import {NftStandard} from "../../types/nft";
import {IonRow, IonCol} from '@ionic/react';

interface Props {
    item: NftStandard;
    showInfo?: boolean;
    count?: number
}

export const NftItem: React.FC<Props> = ({item, showInfo = false, count}) => {
    return (<>
        <div className="nft-list">
            <div className="nft-img">
                <img src={item.meta.image}/>
            </div>
            {
                showInfo && <div className="nft-item">
                    {
                        count ? <IonRow>
                            <IonCol size="10" className="nft-symbol">{item.symbol}</IonCol>
                            <IonCol size="2">{count}</IonCol>
                        </IonRow>
                            :
                            <IonRow>
                                <IonCol size="12" className="nft-symbol">{item.name}</IonCol>
                            </IonRow>
                    }

                </div>
            }
        </div>
    </>)
}