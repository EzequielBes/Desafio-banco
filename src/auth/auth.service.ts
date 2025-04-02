import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private validate: JwtStrategy,
  ) {}

  async signIn(payload): Promise<{access_token:string}> {
    const token = {
      access_token: await this.jwtService.signAsync(payload),
    };
    return token;
  }

  async decoded(auth):Promise<string> {
    const [type, token] = auth?.split(" ") ?? [];
    if (type !== "Bearer") return undefined;
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    return payload.account_id;
  }
}
