import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { AccountModule } from 'src/account/account.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    AccountModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '360000000s' },
    }),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy],
  exports:[AuthService,JwtStrategy]
})
@Global()
export class AuthModule {}
