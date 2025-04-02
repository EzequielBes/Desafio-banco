import { Account } from "../account/account";
import { AccountRepository } from "../account/account-respository";
import { DataSource, Repository } from "typeorm";
import { AccountEntity } from "./account.entity";
import { Injectable } from "@nestjs/common/decorators";
import { HttpException } from "@nestjs/common/exceptions";


@Injectable()
export class AccountRepositoryTypeorm implements AccountRepository {
  private readonly repository: Repository<AccountEntity>;

  constructor(private readonly dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AccountEntity);
  }
    

  async findByEmail(email: string): Promise<Account> {
    const accountInDb = await this.repository.findOne({
      where: { email: email },
    });
    if (!accountInDb) return;
    return Account.restore(
      accountInDb.id,
      accountInDb.email,
      accountInDb.password,
      accountInDb.username,
    );
  }

  async findById(id: string): Promise<Account> {
    const accountInDb = await this.repository.findOne({ where: { id: id } });
    if (!accountInDb) return;
    return Account.restore(
      accountInDb.id,
      accountInDb.email,
      accountInDb.password,
      accountInDb.username,
    );
  }

  async create(account: Account): Promise<void> {
    const accountToBeCreated = this.repository.create({
      id: account.account_id,
      password: account.password,
      username: account.username,
      email: account.email,
    });
    await this.repository.save(accountToBeCreated);
  }

  async update(
    updatedAccount: Account
  ) {
    const account = await this.repository.findOne({
      where: { id: updatedAccount.account_id },
    });
    if (!account) throw new HttpException("Account not found", 404)
    if (updatedAccount.email) account.email = updatedAccount.email;
    if (updatedAccount.username) account.username = updatedAccount.username;
    if (updatedAccount.password) account.password = updatedAccount.password;
    await this.repository.save(account);
  }

  async delete(account_id: string): Promise<void> {
        await this.repository.delete({id: account_id})
    }
}
