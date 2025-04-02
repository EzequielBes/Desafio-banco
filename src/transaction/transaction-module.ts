
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction-controller';
import { DatabaseModule } from '@/database/database.module';
import { TransactionRepository } from './transaction.repository';
import { TransactionRepositoryTypeorm } from '@/database/transaction-repository-typeorm';
import { AccountModule } from '@/account/account.module';
import { TransactionConsumer } from './transaction-consumer';

@Global()
@Module({
  imports: [DatabaseModule,AccountModule],
  controllers: [TransactionController],
  providers: [
    TransactionService, 
    TransactionConsumer,
    {
        provide:TransactionRepository,
        useClass:TransactionRepositoryTypeorm
    }],
  exports: [TransactionConsumer],
})
export class TransactionModule {}
