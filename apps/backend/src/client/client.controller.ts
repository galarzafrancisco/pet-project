import {
  Controller,
  Get,
  Inject
} from '@nestjs/common';
import {
  ApiOperation
} from '@nestjs/swagger';
import { ClientService } from './client.service';

@Controller('client')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
  ) { }

  @ApiOperation({ summary: 'List all clients' })
  @Get('/')
  async listClients() {
    return this.clientService.listClients();
  }
}
