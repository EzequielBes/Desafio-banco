import { TransactionRepository } from "@/transaction/transaction.repository";
import { TransactionEntity } from "./transaction.entity";
import { DataSource, Repository } from "typeorm";
import { Transaction } from "../transaction/transaction";
import { Injectable } from "@nestjs/common/decorators";

@Injectable()
export class TransactionRepositoryTypeorm implements TransactionRepository {
    private readonly repository: Repository<TransactionEntity>

    constructor(private readonly dataSource: DataSource) {
        this.repository = this.dataSource.getRepository(TransactionEntity)
    }

    async findAllTransaction(owner_id: string): Promise<Transaction[] | null> {
       const transactions = await this.repository.find({
        where: {
            sender_id: owner_id,
            receiver_id: owner_id
        }
       })
       if(!transactions) return null;
        const transactionsMap = transactions.map((values)=> {
        return Transaction.restore(
            values.id,
            values.sender_id,
            values.receiver_id,
            values.status,
            values.amount,
            values.created_at,
            values.sender.username,
            values.receiver.username,
        )
   })
        return transactionsMap

    }

    async findTransactionById(id: string): Promise<Transaction | null> {
        const transaction = await this.repository.findOne({
            where: {
                id: id
            }
        })

        if(!transaction) return null;
        return Transaction.restore(
            transaction.id,
            transaction.sender_id,
            transaction.receiver_id,
            transaction.status,
            transaction.amount,
            transaction.created_at,
            transaction.sender.username,
            transaction.receiver.username,
        )
    }

    async create(transaction: Transaction): Promise<void> {
        try {
            const create = await this.repository.create({
                id: transaction.transaction_id,
                receiver_id: transaction.receive_id,
                sender_id: transaction.sender_id,
                amount: transaction.amount,
                status: transaction.status,
                created_at: transaction.created_At,
                updated_at: new Date()
            }) 
            console.log(create)
        } catch (err) {
            console.log("erro", err)
        }

    }

    async update(updatedTransaction: Transaction): Promise<void> {
        const update = await this.repository.update(updatedTransaction.transaction_id, {
            status: updatedTransaction.status
        })
    
    }

}