import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class UpdateAccountInput {
  @ApiProperty()
  @IsString()
  id: string

  @ApiProperty()
  @IsOptional() 
  @IsEmail() 
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty()
  @IsOptional()
  @IsStrongPassword()
  password?: string;
}
