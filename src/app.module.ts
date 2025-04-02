import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import typeormConfig from "./database/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { AccountModule } from "./account/account.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { TransactionModule } from "./transaction/transaction-module";
import { AuthGuard } from "./auth/auth.guard";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQModule } from '@bgaldino/nestjs-rabbitmq';
import { RabbitOptions } from "./rabbitmq.config";
import { TransactionConsumer } from "./transaction/transaction-consumer";


@Module({
  imports: [
    RabbitMQModule.register({ useClass: RabbitOptions, injects: [TransactionConsumer] }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    AuthModule,
    DatabaseModule,
    AccountModule,
    AuthModule,
    TransactionModule
  ],
  providers: [
    { provide: APP_GUARD,
       useClass: AuthGuard,}
 ],

})
export class AppModule {}
