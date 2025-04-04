import { Account } from "@/account/account";
import { randomUUID } from "crypto";

export class Transaction {

    private constructor (
        readonly transaction_id : string,
        readonly sender_id : string,
        readonly receive_id: string,
        public status: string,
        readonly amount : number,
        readonly created_at: Date,
        readonly updated_at: Date
    ) {}

    static create (sender_id:string, receive_id:string, amount:number, status?:string | null) {
        const id = randomUUID()
        return new Transaction(id, sender_id, receive_id, status , amount, new Date(), new Date())
    }

    static restore (transaction_id:string, sender_id:string, receive_id:string,status:string, amount: number, created_at:Date, updated_at:Date) {
        return new Transaction(transaction_id, sender_id, receive_id, status, amount, created_at, updated_at)
    }
}