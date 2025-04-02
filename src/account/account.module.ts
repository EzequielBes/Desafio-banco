import { AccountController } from "./account-controller";
import { AccountService } from "./account-service";
import { AccountRepositoryTypeorm } from "../database/account-repository-typeorm";
import { AccountRepository } from "./account-respository";
import { DatabaseModule } from "../database/database.module";
import { Module } from "@nestjs/common/decorators";

@Module({
  imports: [DatabaseModule],
  controllers: [AccountController],
  providers: [AccountService, 
    {
      provide:AccountRepository,
      useClass:AccountRepositoryTypeorm
    }],
  exports: [AccountService,AccountRepository],
})
export class AccountModule {}
