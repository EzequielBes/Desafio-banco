import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateAccountInput {
 
  @IsEmail()
  email: string;

  @IsString()
  username: string;
  
  @IsStrongPassword()
  password: string;
}
