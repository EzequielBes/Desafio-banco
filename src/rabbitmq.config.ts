import { Injectable } from "@nestjs/common";
import {
  RabbitMQModuleOptions,
  RabbitOptionsFactory,
} from "@bgaldino/nestjs-rabbitmq";
import { TransactionConsumer } from "./transaction/transaction-consumer";

@Injectable()
export class RabbitOptions implements RabbitOptionsFactory {
  constructor(private readonly transactionConsumer: TransactionConsumer) {}
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
        
      ],
    };
  }
}
