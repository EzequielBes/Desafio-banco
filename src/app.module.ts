import { AuthService } from "./auth/auth.service";
import { Interceptor } from "./interceptor";
import { forwardRef, MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import typeormConfig from "./database/typeorm.config";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { AccountModule } from "./account/account.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { TransactionModule } from "./transaction/transaction-module";
import { AuthGuard } from "./auth/auth.guard";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { RabbitMQModule } from "@bgaldino/nestjs-rabbitmq";
import { RabbitOptions } from "./rabbitmq.config";
import { ConsumerModule } from "./consumer/consumer.module";
import { LoggerModule } from "nestjs-pino";
import { CustomLogger } from "./utils/custom.logger";
import { HttpLoggerMiddleware } from "./utils/logger.middleware";

@Module({
  imports: [
    RabbitMQModule.register({
      useClass: RabbitOptions,
      injects: [ConsumerModule],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeormConfig],
    }),
    AuthModule,
    DatabaseModule,
    AccountModule,
    AuthModule,
    TransactionModule,
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV !== "production" ? "debug" : "info",
        transport:
          process.env.NODE_ENV !== "production"
            ? { target: "pino-pretty" }
            : undefined,
      },
    }),
  ],
  providers: [
    CustomLogger,
    { provide: APP_GUARD, useClass: AuthGuard },
    Interceptor,
    AuthService,
  ],
  exports: [CustomLogger],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes("*");
  }
}
