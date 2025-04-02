import { Account } from "./account";

export abstract class AccountRepository {
  abstract findByEmail(email:string): Promise<Account | null>;
  abstract findById(id:string):Promise<Account | null>
  abstract create(account: Account): Promise<void>;
  abstract update(updatedAccount: Account):Promise<void>
  abstract delete(account_id:string):Promise<void>
}
