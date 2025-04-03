
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction-controller';
import { DatabaseModule } from '@/database/database.module';
import { TransactionRepository } from './transaction.repository';
import { TransactionRepositoryTypeorm } from '@/database/transaction-repository-typeorm';
import { AccountModule } from '@/account/account.module';


@Global()
@Module({
  imports: [DatabaseModule,AccountModule],
  controllers: [TransactionController],
  providers: [
    TransactionService, 
    {
        provide:TransactionRepository,
        useClass:TransactionRepositoryTypeorm
    }],
  exports: [TransactionRepository],
})
export class TransactionModule {}
