import { ApiProperty } from "@nestjs/swagger";

export class GetAmountDTO {
    @ApiProperty()
    owner_id: string
}