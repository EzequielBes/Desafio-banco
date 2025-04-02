import { randomUUID } from "crypto";


export class Account {
  private constructor(
    readonly account_id: string,
    readonly email: string,
    readonly password: string,
    readonly username: string,
  ) {}

  static create (email, password, username) {
    const account_id = randomUUID()
    return new Account(account_id, email, password, username)
  }

  static restore (account_id:string, email:string, password:string, username:string) {
    return new Account(account_id, email,  password, username)
  }

 
}
