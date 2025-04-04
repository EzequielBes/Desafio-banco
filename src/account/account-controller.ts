
import { AccountService } from "./account-service";
import { CreateAccountInput } from "./dto/create-account-input";
import { Public } from "src/auth/constants";
import { UpdateAccountInput } from "./dto/update-account-input";
import { SigninAccountDto } from "./dto/signin-account-input";
import { Signintype } from "./types/signin.type";
import { Body, Controller, Delete, Get, Headers, Post, Put } from "@nestjs/common/decorators";
import { DeleteAccountDTO } from "./dto/delete_account.input";
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiSecurity, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { ACCOUNT_EXISTS, USER_INVALID } from "@/constants";
import { ErrorResponseDto } from "@/swaggerResponses/swaggerDTO";
import { ListAccountResponse } from "./dto/listAccount-response";


@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @ApiOperation({
    summary: 'Cria nova conta de usuario'
  })
  @ApiCreatedResponse({})
  @ApiBadRequestResponse({description: "Bad request", type: ErrorResponseDto})
  @ApiConflictResponse({description:ACCOUNT_EXISTS.message})
  @Public()
  @Post("signup")
  async signup(@Body() body: CreateAccountInput): Promise<void> {
    await this.accountService.create({
      email: body.email,
      password: body.password,
      username: body.username,
    });
  }
  @ApiBadRequestResponse({description: "Bad request", type: ErrorResponseDto})
  @ApiUnauthorizedResponse({description: USER_INVALID.message})
  @ApiInternalServerErrorResponse({description: "Erro interno do servidor.",})
  @ApiCreatedResponse({type: Signintype})
  @Public()
  @Post("signin")
  async signin(@Body() body: SigninAccountDto): Promise<Signintype> {
    return await this.accountService.signin(body);
  }

  @ApiOperation({
    summary: "Update account information",
    description: "Atualiza as informações da conta do usuário. Requer autenticação com Bearer Token.",
  })
  @ApiBearerAuth() 
  @ApiCreatedResponse({description: "Informações da conta atualizadas com sucesso.",})
  @ApiBadRequestResponse({description: "Bad request", type: ErrorResponseDto})
  @ApiUnauthorizedResponse({description: "Token de autenticação inválido ou ausente.",})
  @ApiInternalServerErrorResponse({description: "Erro interno do servidor.",})
  @ApiBearerAuth()
  @Put("update")
  async update(@Body() body: UpdateAccountInput): Promise<void> {
    await this.accountService.update(body);
  }

  @ApiResponse({status:200, description: "lista usuarios", isArray:true, type:ListAccountResponse })
  @ApiBearerAuth()
  @Get("listAccounts")
  async listAccount(){
    return await this.accountService.listAccountsId()
  }

 @ApiOperation({
    summary: "Delete account",
    description: "Deleta a conta do usuário autenticado. Requer autenticação com Bearer Token.",
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: "Conta deletada com sucesso.",
  })
  @ApiResponse({
    status: 401,
    description: "Token de autenticação inválido ou ausente.",
  })
  @ApiResponse({
    status: 500,
    description: "Erro interno do servidor.",
  })
  @ApiBearerAuth()
  @Delete("delete")
  async delete(@Body() body: DeleteAccountDTO): Promise<void> {
    await this.accountService.delete(body.id);
  }
}
