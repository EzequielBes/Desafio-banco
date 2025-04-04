import { ApiProperty } from "@nestjs/swagger";

export class ListAccountResponse {
    @ApiProperty()
    name: string

    @ApiProperty()
    account_id: string
}