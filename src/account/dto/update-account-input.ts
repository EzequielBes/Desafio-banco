import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateAccountInput {
  
  @IsOptional() 
  @IsEmail() 
  email?: string;

  
  @IsOptional()
  @IsString()
  username?: string;

 
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
