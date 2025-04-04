import { 
    BadRequestException, 
    Body, 
    Controller, 
    Get, 
    Post 
} from "@nestjs/common";
import { ApiBearerAuth, ApiBadRequestResponse, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiResponse, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";

import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { GetAmountDTO } from "./dto/getAmount";
import { RefoundTransactionDto } from "./dto/refoundTransactionDTO";
import { TransactionService } from "./transaction.service";
import { ErrorResponseDto } from "@/swaggerResponses/swaggerDTO";
import { INSUFFICIENT_BALANCE, Receiver_NOT_FOUND, UNAUTHORIZED } from "@/constants";
import { TransactionResponseDto } from "./dto/listTransactionDTO";

@Controller("transactions")
export class TransactionController {
    constructor(private readonly transactionService: TransactionService) {}

    @Post("/create")
    @ApiBearerAuth()
    @ApiCreatedResponse({ example: { message: "Transação enviada" } })
    @ApiUnprocessableEntityResponse({ description: INSUFFICIENT_BALANCE.message, example: INSUFFICIENT_BALANCE })
    @ApiNotFoundResponse({ description: Receiver_NOT_FOUND.message, example: Receiver_NOT_FOUND })
    @ApiBadRequestResponse({ description: "Bad request", type: ErrorResponseDto })
    @ApiInternalServerErrorResponse({ description: "Erro interno do servidor." })
    @ApiUnauthorizedResponse({ description: "Unauthorized", example: UNAUTHORIZED })
    create(@Body() body: CreateTransactionDTO) {
        return this.transactionService.create(body);
    }

    @Post("/deposit")
    @ApiBearerAuth()
    @ApiCreatedResponse({ example: { data: "O depósito de R$ 2000.34 foi feito com sucesso" } })
    @ApiInternalServerErrorResponse({ description: "Erro interno do servidor." })
    deposit(@Body() body: CreateTransactionDTO) {
        return this.transactionService.deposit(body);
    }

    @Get("/viewBalance")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, example: { data: "Seu saldo atual é de R$ 2000.34" } })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    findAllTransactions(@Body() body: GetAmountDTO) {
        return this.transactionService.viewBalance(body);
    }

    @Post("/refound")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, example: {data: "Reembolso realizado com sucesso"} })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    @ApiNotFoundResponse({ description: "Transação não encontrada." })
    refoundTransaction(@Body() body: RefoundTransactionDto) {
        return this.transactionService.refoundTransaction(body.owner_id, body.transaction_id);
    }

    @Get("/listTransactions")
    @ApiBearerAuth()
    @ApiResponse({ status: 200, type:TransactionResponseDto })
    @ApiUnauthorizedResponse({ description: "Unauthorized" })
    listTransactions(@Body() body: GetAmountDTO) {
        return  this.transactionService.listAllTransactions(body.owner_id);
    }
}
