import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ClientEntity } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    private readonly clientRepository: Repository<ClientEntity>,
  ) { }

  public async listClients(): Promise<ClientEntity[]> {
    return this.clientRepository.find();
  }
}
