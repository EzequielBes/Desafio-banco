
import { AccountService } from "./account-service";
import { CreateAccountInput } from "./dto/create-account-input";
import { Public } from "src/auth/constants";
import { UpdateAccountInput } from "./dto/update-account-input";
import { SigninAccountDto } from "./dto/signin-account-input";
import { Signintype } from "./types/signin.type";
import { Body, Controller, Delete, Headers, Post, Put } from "@nestjs/common/decorators";


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
  async update(@Body() body: UpdateAccountInput, @Headers() token: any): Promise<void> {
    const idToken = token.authorization;
    await this.accountService.update(body, idToken);
  }

 
  @Delete("delete")
  async delete(@Headers() token: any): Promise<void> {
    const idToken = token.authorization;
    await this.accountService.delete(idToken);
  }
}
