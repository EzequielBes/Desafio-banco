// import {
//     CallHandler,
//     ExecutionContext,
//     Injectable,
//     NestInterceptor,
//     BadRequestException,
//     HttpException,
//     UnauthorizedException,
//   } from '@nestjs/common';
//   import { Observable } from 'rxjs';
// import { AuthService } from './auth/auth.service';
// import { UNAUTHORIZED } from './constants';
  
//   @Injectable()
//   export class Interceptor implements NestInterceptor {
//     constructor(readonly authService : AuthService) {
//     } 
  
//     async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
//       const request = context.switchToHttp().getRequest();
//       const authHeader = request.headers['authorization'];
      
//       if (request.url === "/transactions/create" || request.url === "/transactions/viewBalance" || request.url === '/transactions/deposit') {
//         try {
//             const id = request.body["owner_id"]
//           const extractedId = await this.authService.decoded(authHeader);
//           if(id !== extractedId) {
//             throw new UnauthorizedException(UNAUTHORIZED.message)
//           }
//           console.log("ID extraído:", extractedId);
//         } catch (error) {
//           throw new BadRequestException("Token inválido ou ausente.");
//         }
//       }

//       if(request.url == "/account/update" || request.url == "/account/delete") {
//         try {
//             const id = request.body["id"]
//           const extractedId = await this.authService.decoded(authHeader);
//           if(id !== extractedId) {
//             throw new UnauthorizedException(UNAUTHORIZED.message)
//           }
//           console.log("ID extraído:", extractedId);
//         } catch (error) {
//           throw new BadRequestException("Token inválido ou ausente.");
//         }
//       }
  
//       return next.handle();
//     }
//   }
import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { AuthService } from './auth/auth.service';
  import { UNAUTHORIZED } from './constants';
  
  @Injectable()
  export class Interceptor implements NestInterceptor {
    constructor(private readonly authService: AuthService) {}
  
    private readonly protectedRoutes: Record<string, string> = {
      '/transactions/create': 'owner_id',
      '/transactions/viewBalance': 'owner_id',
      '/transactions/deposit': 'owner_id',
      '/transactions/listTransactions': 'owner_id',
      'transactions/refound': "owner_id",
      '/account/update': 'id',
      '/account/delete': 'id',
    };
  
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      const routeKey = request.url;
      
      if (this.protectedRoutes[routeKey]) {
        try {
          if (!authHeader) {
            throw new UnauthorizedException("Token ausente.");
          }
          
          const extractedId = await this.authService.decoded(authHeader);
          const requestId = request.body?.[this.protectedRoutes[routeKey]];
          
          if (!requestId || requestId !== extractedId) {
            console.log(requestId, extractedId)
            throw new UnauthorizedException(UNAUTHORIZED.message);
          }
          
          console.log("ID extraído:", extractedId);
        } catch (error) {
          throw new BadRequestException("Token inválido ou erro na autenticação.");
        }
      }
  
      return next.handle();
    }
  }
  