import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { Transaction } from "./transaction";
import { AccountRepository } from "@/account/account-respository";
import { TransactionRepository } from "./transaction.repository";
import { RabbitMQService } from "@bgaldino/nestjs-rabbitmq";
import { GetAmountDTO } from "./dto/getAmount";
import { INSUFFICIENT_BALANCE, Receiver_NOT_FOUND } from "@/constants";


@Injectable()
export class TransactionService {

    constructor (
        private readonly rabbitMQService: RabbitMQService,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository : TransactionRepository
    ) {}

    async create (body: CreateTransactionDTO) {
        const create = Transaction.create(body.sender_id, body.receiver_id, body.amount)
        const sender = await this.accountRepository.findById(body.sender_id)
        const receiver = await this.accountRepository.findById(body.receiver_id)
        if(!sender || !receiver) throw new NotFoundException(Receiver_NOT_FOUND.message);
         const balance = await this.getAmount(body.sender_id)
         await this.transactionRepository.create(create)
         if(balance < body.amount) throw new HttpException(INSUFFICIENT_BALANCE.message, INSUFFICIENT_BALANCE.statusCode) ;
         const isPublish = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);  
         if(isPublish) return {message: 'Transação enviada'}
        
    }

    async deposit (body: CreateTransactionDTO) {
        const receiver = await this.accountRepository.findById(body.receiver_id)
        console.log("id do receiver", receiver)
        if(!receiver) throw new NotFoundException(``);
        const create = Transaction.create(body.sender_id, body.receiver_id, body.amount, "deposit")
        const save = await this.transactionRepository.create(create)
        const fila = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);
    }

    async viewBalance(owner_id: GetAmountDTO ) {
        const balance = await this.getAmount(owner_id.owner_id)
        return {message: `Seu saldo atual é de R$ ${balance}`}
    }


    //async refound (sender_id) {}

    async getAmount(owner_id: string) {
        const transactionHistory = await this.transactionRepository.findAllTransaction(owner_id);
        let amount = 0
        const mont = transactionHistory.reduce(function(acc, total) {
            let key = total.status
            const amout = parseFloat(total.amount.toString())
            if(key == "deposit") {
                return acc + amout
            }
            if(key == 'pending' && total.sender_id == owner_id) {
                return acc - amout
            }
            if(key == 'success' && total.sender_id == owner_id) {
                return acc - amout
            }
            if(key == 'success' && total.receive_id == owner_id) {
                return acc + amout
            }
            if(key == 'refunded' && total.sender_id == owner_id) {
                return acc + amout
            }
            if(key == 'refunded' && total.receive_id == owner_id) {
                return acc - amout
            }
            return acc
        }, amount)
        
        return mont
    }


    
    
}