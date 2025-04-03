
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { DatabaseModule } from '@/database/database.module';
import { TransactionRepositoryTypeorm } from '@/database/transaction-repository-typeorm';
import { AccountModule } from '@/account/account.module';
import { TransactionConsumer } from './transaction-consumer';
import { ReversalTransactionConsumer } from './reversal-transaction-consumer';
import { TransactionModule } from '@/transaction/transaction-module';


@Global()
@Module({
  imports: [TransactionModule],
  controllers: [],
  providers: [
    TransactionConsumer,
    ReversalTransactionConsumer,
  ],
  exports: [TransactionConsumer,ReversalTransactionConsumer],
})
export class ConsumerModule {}
