import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ClientDto {
  @ApiProperty({
    description: 'The unique identifier of the client',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  @IsUUID()
  id!: string;

  @ApiProperty({
    description: 'The name of the client',
    example: 'Acme Corporation',
  })
  @IsString()
  name!: string;
}