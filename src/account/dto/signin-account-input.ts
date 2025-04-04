import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class SigninAccountDto {
    
    @ApiProperty({example: "email@email.com"})
    @IsEmail()
    email: string

    @ApiProperty()
    @IsStrongPassword()
    password: string
}
