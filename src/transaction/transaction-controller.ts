import { BadRequestException, Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { TransactionService } from "./transaction.service";
import { Public } from "@/auth/constants";
import { GetAmountDTO } from "./dto/getAmount";
import { ApiBadGatewayResponse, ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiProperty, ApiUnauthorizedResponse, ApiUnprocessableEntityResponse } from "@nestjs/swagger";
import { INSUFFICIENT_BALANCE, Receiver_NOT_FOUND, UNAUTHORIZED } from "@/constants";
import { ErrorResponseDto } from "@/swaggerResponses/swaggerDTO";
import { RefoundTransactionDto } from "./dto/refoundTransactionDTO";


@Controller("transactions")
export class TransactionController {

    constructor (
        private readonly transactionService: TransactionService
    ) {}
    
    @ApiCreatedResponse({})
    @ApiUnprocessableEntityResponse({description: INSUFFICIENT_BALANCE.message, example: INSUFFICIENT_BALANCE })
    @ApiNotFoundResponse({description: Receiver_NOT_FOUND.message, example: Receiver_NOT_FOUND})
    @ApiBadRequestResponse({description: "Bad request", type: ErrorResponseDto})
    @ApiInternalServerErrorResponse({description: "Erro interno do servidor." })
    @ApiUnauthorizedResponse({description: "Unauthorized", example:UNAUTHORIZED })
    @ApiBearerAuth()
    @Post("/create")
    create (@Body() body: CreateTransactionDTO) {
        return this.transactionService.create(body)
    }
    
    @ApiInternalServerErrorResponse({description: "Erro interno do servidor.",})
    @ApiCreatedResponse({example: "teste"})
    @ApiBearerAuth()
    @Post("/deposit")
    deposit (@Body() body: CreateTransactionDTO) {
        return this.transactionService.deposit(body)
    }

    @ApiBearerAuth()
    @Get("/viewBalance")
    findAllTransactions (@Body() body: GetAmountDTO) {
        return this.transactionService.viewBalance(body)
    }

    @Post("/refound")
    refoundTransaction(@Body() body: RefoundTransactionDto) {
        return this.transactionService.refoundTransaction(body.owner_id, body.transaction_id)
    }

    @Get("/listTransactions")
    listTransactions(@Body() body: GetAmountDTO) {
        return this.transactionService.listAllTransactions(body.owner_id)
    }

}