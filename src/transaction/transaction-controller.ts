import { Body, Controller, Get, Post } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { TransactionService } from "./transaction.service";
import { Public } from "@/auth/constants";
import { GetAmountDTO } from "./dto/getAmount";


@Controller("transactions")
export class TransactionController {

    constructor (
        private readonly transactionService: TransactionService
    ) {}
    
    @Post("/create")
    create (@Body() body: CreateTransactionDTO) {
        return this.transactionService.create(body)
    }


    @Post("/deposit")
    deposit (@Body() body: CreateTransactionDTO) {
        return this.transactionService.deposit(body)
    }

    @Get("/viewBalance")
    findAllTransactions (@Body() body: GetAmountDTO) {
        return this.transactionService.viewBalance(body)
    }

    @Post("/refound")
    refoundTransaction(@Body() transaction_id: string) {
        //return this.transactionService.
    }

    updateTransaction () {}
}