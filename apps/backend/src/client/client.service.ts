import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './client.entity';
import { ClientDto } from './dto/client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly clientRepository: Repository<ClientEntity>,
  ) { }

  public async listClients(): Promise<ClientDto[]> {
    return this.clientRepository.find();
  }
}
