import { Controller } from "@nestjs/common";

import { TransactionRepository } from "./transaction.repository";
import { Transaction } from "./transaction";

import {
  IRabbitConsumer,
  RabbitConsumerParameters,
} from "@bgaldino/nestjs-rabbitmq";

export class TransactionConsumer implements IRabbitConsumer {
  private RETRY_LIMIT: number = 3;
  constructor(
    readonly transactionsRepository: TransactionRepository,
  ) {}

  async messageHandler(
    content: any,
    parameters?: RabbitConsumerParameters,
  ): Promise<void> {
    console.log(content)
    await this.transactionsRepository.update(content);
    throw new Error("zz gay")
  
}
}
