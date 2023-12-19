import {Cross} from "../index";
import BigNumber from "bignumber.js";
import EthContract from "../../EthContract";
import {AccountModel,ChainType} from '@emit-technology/emit-lib';

const ABI_CROSS = [
    {
        "inputs": [],
        "name": "_chainID",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "originChainID",
                "type": "uint8"
            },
            {
                "internalType": "uint64",
                "name": "depositNonce",
                "type": "uint64"
            },
            {
                "internalType": "bytes32",
                "name": "resourceID",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "recipient",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "callback",
                "type": "bytes"
            },
            {
                "internalType": "bytes[]",
                "name": "signs",
                "type": "bytes[]"
            }
        ],
        "name": "commitVotes",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint8",
                "name": "destinationChainID",
                "type": "uint8"
            },
            {
                "internalType": "bytes32",
                "name": "resourceID",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "recipient",
                "type": "bytes"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "callback",
                "type": "bytes"
            }
        ],
        "name": "depositFT",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceId",
                "type": "bytes32"
            }
        ],
        "name": "minCrossAmount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "resourceId",
                "type": "bytes32"
            }
        ],
        "name": "resourceIDToLimit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "minAmount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "maxAmount",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

class EthCross extends EthContract implements Cross{

    constructor(address:string,chain:ChainType) {
        super(address,ABI_CROSS,chain);
    }

    depositFT(destinationChainID: number, resourceID: string, recipient: string, amount: BigNumber): Promise<any> {
        return this.contract.methods.depositFT(destinationChainID,resourceID,recipient,"0x"+amount.toString(16),"0x").encodeABI()
    }

    minCrossAmount = async (resourceId: string): Promise<string> => {
        return await this.contract.methods.minCrossAmount(resourceId).call()
    }

    resourceIDToLimit = async (resourceId: string): Promise<Array<BigNumber>> => {
        const rest = await this.contract.methods.resourceIDToLimit(resourceId).call()
        return [new BigNumber(rest[0]),new BigNumber(rest[1])]
    }

    commitVotes = async (originChainID: number, depositNonce: number,resourceID:string, recipient: string, amount: BigNumber, callback:any,signs:any): Promise<any> => {
        return this.contract.methods.commitVotes(originChainID,depositNonce,resourceID,recipient,"0x"+amount.toString(16),callback,signs).encodeABI()
    }

}

export default EthCross