import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RefoundTransactionDto {

    @ApiProperty()
    @IsString()
    owner_id: string

    @ApiProperty()
    @IsString()
    transaction_id: string
}