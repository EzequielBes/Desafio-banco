import { ApiProperty } from "@nestjs/swagger";

export class CreateTransactionDTO {

    @ApiProperty()
    owner_id: string

    @ApiProperty()
    receiver_id:string

    @ApiProperty()
    amount: number
}