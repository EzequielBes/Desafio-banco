import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiPropertyOptional({ example: 400 })
  statusCode?: number;

  @ApiPropertyOptional({ example: 'Invalid input data' })
  message?: string | string[];
}