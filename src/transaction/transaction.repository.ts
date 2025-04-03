import { Transaction } from "./transaction";


export abstract class TransactionRepository {
  abstract findAllTransaction(owner_id:string): Promise<Transaction[] | null>;
  abstract findTransactionById(id: string): Promise<Transaction | null>;
  abstract create(transaction: Transaction): Promise<void>;
  abstract update(transaction: Transaction, status: string): Promise<void>;
}
