import {emitBoxSdk} from "../emit";
import {ChainType, SettleResp} from "@emit-technology/emit-lib";
import {crossBillService} from "../cross/bill";
import {CrossBill, SourceId} from "../../types/cross";

class InboxService {

    listUnsettle = async (): Promise<Array<SettleResp | CrossBill>> =>{
        const account = await emitBoxSdk.getAccount();
        const settles = await emitBoxSdk.emitBox.emitDataNode.getUnSettles(account.addresses[ChainType.EMIT]);
        const bills = await crossBillService.list(ChainType.BSC);
        const billsETH = await crossBillService.list(ChainType.ETH);
        const data: Array<any> = [];
        if (bills && bills.length > 0) {
            data.push(...bills);
        }
        if (billsETH && billsETH.length > 0) {
            data.push(...billsETH);
        }
        // const settled:Array<SettleResp> = [];
        if (settles && settles.length > 0) {
            for(let settle of settles){
                if(settle.settled){
                    // settled.push(settle)
                }else{
                    data.push(settle)
                }
            }
        }
        data.sort(this._sort)
        return data;
    }

    private _sort = (a1: any, b1: any) => {
        let t1 = 0, t2 = 0, tenYear = 10 * 365 * 24 * 60 * 60 * 100;
        if (a1["factor"] && a1["factor"]["timestamp"]) {
            t1 = a1["factor"]["timestamp"];
        } else {
            t1 = a1["timestamp"];
            t1 = t1*10000;
        }
        if (b1["factor"] && b1["factor"]["timestamp"]) {
            t2 = b1["factor"]["timestamp"];
        } else {
            t2 = b1["timestamp"]
            t2 = t2*1000;
        }
        return t2 - t1;
    }

}

export const inboxService = new InboxService();