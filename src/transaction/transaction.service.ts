import { BadRequestException, HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateTransactionDTO } from "./dto/createTransactionDTO";
import { Transaction } from "./transaction";
import { AccountRepository } from "@/account/account-respository";
import { TransactionRepository } from "./transaction.repository";
import { RabbitMQService } from "@bgaldino/nestjs-rabbitmq";
import { GetAmountDTO } from "./dto/getAmount";
import { ALREADY_REFOUND, INSUFFICIENT_BALANCE, Receiver_NOT_FOUND, REFOUND_LIMIT } from "@/constants";
import { RefoundTransactionDto } from "./dto/refoundTransactionDTO";


@Injectable()
export class TransactionService {

    constructor (
        private readonly rabbitMQService: RabbitMQService,
        private readonly accountRepository: AccountRepository,
        private readonly transactionRepository : TransactionRepository
    ) {}

    async create (body: CreateTransactionDTO) {
        const sender = await this.accountRepository.findById(body.owner_id)
        const receiver = await this.accountRepository.findById(body.receiver_id)
        if(!sender || !receiver) throw new NotFoundException(Receiver_NOT_FOUND.message);
        const balance = await this.getAmount(body.owner_id)
        const create = Transaction.create(body.owner_id, body.receiver_id, body.amount)
        if(balance < body.amount) throw new HttpException(INSUFFICIENT_BALANCE.message, INSUFFICIENT_BALANCE.statusCode) ;
        await this.transactionRepository.create(create)
         const isPublish = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);  
         if(isPublish) return {message: 'Transação enviada'}
        
    }

    async deposit (body: CreateTransactionDTO) {
        const receiver = await this.accountRepository.findById(body.receiver_id)
        console.log("id do receiver", receiver)
        if(!receiver) throw new NotFoundException(``);
        const create = Transaction.create(body.owner_id, body.receiver_id, body.amount, "deposit")
        const save = await this.transactionRepository.create(create)
        const fila = await this.rabbitMQService.publish('transfer-exchange', 'transaction', create);
        if(fila == false) throw new HttpException("An error occurred while the deposit was being processed.", 500)
        return `O deposito de ${body.amount.toFixed(2)} foi feito com sucesso`
    }

    async viewBalance(owner_id: GetAmountDTO ) {
        const balance = await this.getAmount(owner_id.owner_id)
        return {message: `Seu saldo atual é de R$ ${balance.toFixed(2)}`}
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


    async refoundTransaction (owner_id:string, transaction_id:string) {
        const findTransaction = await this.transactionRepository.findTransactionById(transaction_id)
        if(findTransaction.status == "refunded") throw new HttpException(ALREADY_REFOUND.message, ALREADY_REFOUND.statusCode);
        let status = findTransaction.status
        let maxRefoundDays = 1
        let diffTimer = Math.abs(findTransaction.updated_at .getTime() - new Date().getTime())
        let diffDate = Math.ceil(diffTimer / (1000 * 3600 * 24));
        if(status === "success" || status === "pending" && diffDate > maxRefoundDays) {
            findTransaction.status = "refunded"
            const isPublish = await this.rabbitMQService.publish('transfer-exchange', 'transaction', findTransaction);  
        } else {
            throw new HttpException(REFOUND_LIMIT.message, REFOUND_LIMIT.statusCode);
        }
        return "Reembolso realizado com sucesso"
    }


    async listAllTransactions (owner_id:string) {
        const list = await this.transactionRepository.findAllTransaction(owner_id)

        const formated = list.reduce((acc, obj) => {
            let key = obj['status']
            if(!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj)
            return acc
        }, {})
        return formated
    }
    
}