import { Controller, Injectable } from "@nestjs/common";
import {
  IRabbitConsumer,
  RabbitConsumerParameters,
  RabbitMQService,
} from "@bgaldino/nestjs-rabbitmq";
import { ModuleRef } from "@nestjs/core";
import { TransactionRepository } from "@/transaction/transaction.repository";
import { Transaction } from "@/transaction/transaction";

@Injectable()
export class TransactionConsumer implements IRabbitConsumer {
  private RETRY_LIMIT: number = 3;
  constructor(
    readonly transactionsRepository: TransactionRepository,
    private readonly rabbitMQService: RabbitMQService,
    //private moduleRef: ModuleRef
  ) {}

  async messageHandler(
    content: Transaction,
    parameters?: RabbitConsumerParameters,
  ): Promise<void> {
    let status = content.status == 'deposit' ? 'deposit' : 'success'

   if(parameters.message.fields.deliveryTag === 5){
    await this.rabbitMQService.publish('transfer-exchange', 'reversal.transaction', content)
    return
   }
   await this.transactionsRepository.update(content, status);
    
}
}
