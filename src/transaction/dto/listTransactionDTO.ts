import { ApiProperty } from "@nestjs/swagger";

class TransactionDto {
    @ApiProperty({ example: "7fbd2987-e341-4ef2-9e58-baec48ec4903" })
    transaction_id: string;

    @ApiProperty({ example: "7c8ceb08-3076-45f4-b8c0-5f985edd58a8" })
    sender_id: string;

    @ApiProperty({ example: "7c8ceb08-3076-45f4-b8c0-5f985edd58a8" })
    receive_id: string;

    @ApiProperty({ example: "deposit" })
    status: string;

    @ApiProperty({ example: "2000.34" })
    amount: string;

    @ApiProperty({ example: "2025-04-04T13:19:21.265Z" })
    created_at: string;

    @ApiProperty({ example: "2025-04-04T13:19:21.278Z" })
    updated_at: string;
}

export class TransactionResponseDto {
    @ApiProperty({ type: [TransactionDto] })
    deposit: TransactionDto[];

    @ApiProperty({ type: [TransactionDto] })
    refunded: TransactionDto[];

    @ApiProperty({ type: [TransactionDto] })
    success: TransactionDto[];
}
