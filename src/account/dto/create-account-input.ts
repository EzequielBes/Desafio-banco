import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class CreateAccountInput {
  
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    username: string;
    
    @ApiProperty()
    @IsStrongPassword()
    password: string;
}
