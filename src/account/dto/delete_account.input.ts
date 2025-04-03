import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class DeleteAccountDTO {
    @ApiProperty()
    @IsString()
    id: string
}