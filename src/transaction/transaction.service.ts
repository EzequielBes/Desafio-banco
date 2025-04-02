import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { Transaction } from "./transaction";
import { AccountRepository } from "@/account/account-respository";
import { TransactionRepository } from "./transaction.repository";
import { RabbitMQService } from "@bgaldino/nestjs-rabbitmq";


@Injectable()
export class TransactionService {

    constructor (
        private readonly rabbitMQService: RabbitMQService,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository : TransactionRepository
    ) {}

    async create (body: CreateTransactionDTO) {
        const create = Transaction.create(body.sender_id, body.receiver_id, body.amount)
        // const sender = await this.accountRepository.findById(body.sender_id)
        // const receiver = await this.accountRepository.findById(body.receiver_id)
        // if(!sender || !receiver) throw new NotFoundException(``);
        // const transactionHistory = await this.transactionRepository.findAllTransaction(body.sender_id);
        // let amount = 0
        // for(let i in transactionHistory) {
        //     if(transactionHistory[i].receive_id == body.sender_id) {
        //         amount = amount + transactionHistory[i].amount
        //         return
        //     }
        //     amount = amount - transactionHistory[i].amount
        // } 
        // if(amount < body.amount) throw new HttpException("Dinheiro insuficiente para concluir a transacao",402) ;
         const isPublish = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);  
         if(isPublish) return {message: 'Transação enviada'}

    }

    async deposit (body: CreateTransactionDTO) {
        const sender = await this.accountRepository.findById(body.sender_id)
        const receiver = await this.accountRepository.findById(body.receiver_id)
        if(!sender || !receiver) throw new NotFoundException(``);
        const create = Transaction.create(body.sender_id, body.receiver_id, body.amount, "aceito")
        const fila = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);
    }

    async getAmount(sender_id: string) {
        const transactionHistory = await this.transactionRepository.findAllTransaction(sender_id);
        let amount = 0
        for(let i in transactionHistory) {
            if(transactionHistory[i].receive_id == sender_id) {
                amount = amount + transactionHistory[i].amount
                return
            }
            amount = amount - transactionHistory[i].amount
        } 
        return `R$ ${amount.toFixed(2)}`
    }
    
}