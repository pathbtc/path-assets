export interface Inbox {
    block: number;
    index: number;
    from: string;
    timestamp: number;
    amount: string;

    token: string;
    tokenHash: string;
}

export interface Balance {
    [chain_symbol_address:string]: string;
}