import { Body, Controller, Post } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { TransactionService } from "./transaction.service";
import { Public } from "@/auth/constants";


@Controller("transactions")
export class TransactionController {

    constructor (
        private readonly transactionService: TransactionService
    ) {}
    
    @Public()
    @Post("/create")
    create (@Body() body: CreateTransactionDTO) {
        console.log("teste")
        return this.transactionService.create(body)
    }

    findAllTransactions () {}

    findOneTransaction () {}

    updateTransaction () {}
}