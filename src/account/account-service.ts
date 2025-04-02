
import { Account } from "./account";
import { AccountRepository } from "./account-respository";
import { AuthService } from "src/auth/auth.service";
import { CreateAccountInput } from "./dto/create-account-input";
import { UpdateAccountInput } from "./dto/update-account-input";
import { Signintype } from "./types/signin.type";
import { Injectable } from "@nestjs/common/decorators";
import { HttpException, UnauthorizedException } from "@nestjs/common/exceptions";

@Injectable()
export class AccountService {
  constructor(
    private accountRepository: AccountRepository,
    private auth: AuthService,
  ) {}

  async create(input: CreateAccountInput): Promise<void> {
    const accountExists = await this.accountRepository.findByEmail(input.email);
    if (accountExists) throw new HttpException("Ja existe uma conta com esse email", 402);
    const account = Account.create(input.email, input.password, input.username);
    await this.accountRepository.create(account);
  }

  async signin(input: { email: string; password: string }) :Promise<Signintype | null> {
    const account = await this.accountRepository.findByEmail(input.email);
    if (!account) throw new UnauthorizedException();
    const getAccount = Account.restore(
      account.account_id,
      account.email,
      account.password,
      account.username,
    );
    if (input.password != getAccount.password)
      throw new HttpException("Usuario ou senha invalidos", 401);
    const payload = {
      userEmail: account.email,
      account_id: account.account_id,
    };
    const token = await this.auth.signIn(payload);
    return token;
  }

  async findOne(email: string) {
    const account = await this.accountRepository.findByEmail(email);
    if (!account) throw new HttpException("Conta não foi encontrada", 404);
    return Account.restore(
      account.account_id,
      account.email,
      account.password,
      account.username,
    );
  }

  async update(input: UpdateAccountInput, headerToken: string) {
    const extractedId = await this.auth.decoded(headerToken);
    const findAcc = await this.accountRepository.findById(extractedId);
    if(!findAcc) throw new HttpException("Conta não foi encontrada", 404);
    const updatedAccount = {account_id: extractedId, email: input.email, username: input.username, password: input.password }
    await this.accountRepository.update(updatedAccount)
    return 
  }
  async delete (token:string) {
    const id = await this.auth.decoded(token);
    const account = await this.accountRepository.findById(id);
    if(!account) throw new HttpException("Conta não foi encontrada", 404);
    await this.accountRepository.delete(account.account_id);
    return 
  }
}
