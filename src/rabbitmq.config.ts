import { Injectable } from "@nestjs/common";
import {
  RabbitMQModuleOptions,
  RabbitOptionsFactory,
} from "@bgaldino/nestjs-rabbitmq";
import { TransactionConsumer } from "./consumer/transaction-consumer";
import { ReversalTransactionConsumer } from "./consumer/reversal-transaction-consumer";


@Injectable()
export class RabbitOptions implements RabbitOptionsFactory {
  constructor(private readonly transactionConsumer: TransactionConsumer, private readonly reversalTransactionConsumer:ReversalTransactionConsumer) {}
  createRabbitOptions(): RabbitMQModuleOptions {
    return {
      connectionString: "amqp://localhost:5672",
      delayExchangeName: "transfer-dealyed-exchange",
      assertExchanges: [
        {
          name: "transfer-exchange",
          type: "topic",
          options: { durable: true, autoDelete: false },
        },
      ],
      consumerChannels: [
        {
          options: {
            queue: "transaction",
            exchangeName: "transfer-exchange",
            routingKey: "transaction",
            prefetch: Number(process.env.RABBIT_PREFETCH ?? 10),
            retryStrategy: {
              enabled: true,
              maxAttempts: 5,
              delay: (attempt: number) => {
                return attempt * 5000;
              },
            },
          },
          messageHandler: this.transactionConsumer.messageHandler.bind(
            this.transactionConsumer,
          ),
        },
        {
          options: {
            queue: "reversal.transaction",
            exchangeName: "transfer-exchange",
            routingKey: "reversal.transaction",
            prefetch: Number(process.env.RABBIT_PREFETCH ?? 10),
            retryStrategy: {
              enabled: true,
              maxAttempts: 5,
              delay: (attempt: number) => {
                return attempt * 5000;
              },
            },
          },
          messageHandler: this.reversalTransactionConsumer.messageHandler.bind(
            this.reversalTransactionConsumer,
          ),
        },
        
      ],
    };
  }
}
