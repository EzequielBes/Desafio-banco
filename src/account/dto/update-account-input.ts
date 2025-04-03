import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateAccountInput {
  @ApiProperty()
  @IsString()
  id: string

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
