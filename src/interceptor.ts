import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    BadRequestException,
    HttpException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
  
  @Injectable()
  export class Interceptor implements NestInterceptor {
    constructor(readonly authService : AuthService) {
    } 
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      
      if (request.url === "/transactions/create") {
        try {
            const sender_id = request.body["sender_id"]
          const extractedId = await this.authService.decoded(authHeader);
          if(sender_id !== extractedId) {
            throw new UnauthorizedException()
          }
          console.log("ID extraído:", extractedId);
        } catch (error) {
          throw new BadRequestException("Token inválido ou ausente.");
        }
      }

      if(request.url == "/account/update" || request.url == "/account/delete") {
        try {
            const id = request.body["id"]
          const extractedId = await this.authService.decoded(authHeader);
          if(id !== extractedId) {
            throw new UnauthorizedException()
          }
          console.log("ID extraído:", extractedId);
        } catch (error) {
          throw new BadRequestException("Token inválido ou ausente.");
        }
      }
  
      return next.handle();
    }
  }
