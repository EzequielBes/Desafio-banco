
import { AccountService } from "./account-service";
import { CreateAccountInput } from "./dto/create-account-input";
import { Public } from "src/auth/constants";
import { UpdateAccountInput } from "./dto/update-account-input";
import { SigninAccountDto } from "./dto/signin-account-input";
import { Signintype } from "./types/signin.type";
import { Body, Controller, Delete, Headers, Post, Put } from "@nestjs/common/decorators";
import { DeleteAccountDTO } from "./dto/delete_account.input";


@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Public()
  @Post("signup")
  async signup(@Body() body: CreateAccountInput): Promise<void> {
    await this.accountService.create({
      email: body.email,
      password: body.password,
      username: body.username,
    });
  }

  @Public()
  @Post("signin")
  async signin(@Body() body: SigninAccountDto): Promise<Signintype | null> {
    return await this.accountService.signin(body);
  }

  @Put("update")
  async update(@Body() body: UpdateAccountInput): Promise<void> {
    await this.accountService.update(body);
  }

 
  @Delete("delete")
  async delete(@Body() body: DeleteAccountDTO): Promise<void> {
    await this.accountService.delete(body.id);
  }
}
