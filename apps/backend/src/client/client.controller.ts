import {
  Controller,
  Get,
  Inject
} from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse
} from '@nestjs/swagger';
import { ClientService } from './client.service';
import { ListClientsResponseDto } from './dto/list-clients-response.dto';

@Controller('clients')
export class ClientController {
  constructor(
    @Inject(ClientService) private readonly clientService: ClientService,
  ) { }

  @ApiOperation({ summary: 'List all clients' })
  @ApiOkResponse({
    description: 'Successfully retrieved list of clients',
    type: ListClientsResponseDto,
  })
  @Get('/')
  async listClients(): Promise<ListClientsResponseDto> {
    const clientEntities = await this.clientService.listClients();
    const clients = clientEntities.map(client => ({ id: client.id, name: client.name }));
    return { clients };
  }
}
