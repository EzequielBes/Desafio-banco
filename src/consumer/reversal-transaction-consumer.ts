import { Controller, Injectable } from "@nestjs/common";
import {
  IRabbitConsumer,
  RabbitConsumerParameters,
} from "@bgaldino/nestjs-rabbitmq";
import { TransactionRepository } from "@/transaction/transaction.repository";
@Injectable()
export class ReversalTransactionConsumer implements IRabbitConsumer {
  private RETRY_LIMIT: number = 3;
  constructor(
    readonly transactionsRepository: TransactionRepository,
  ) {}

  async messageHandler(
    content: any,
    parameters?: RabbitConsumerParameters,
  ): Promise<void> {
    //console.log(content)
    await this.transactionsRepository.update(content, "refunded");

  }
}
