import { ApiProperty } from '@nestjs/swagger';
import { ClientDto } from './client.dto';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ListClientsResponseDto {
  @ApiProperty({
    description: 'List of clients',
    type: [ClientDto],
  })
  @ValidateNested({ each: true })
  @Type(() => ClientDto)
  clients!: ClientDto[];
}