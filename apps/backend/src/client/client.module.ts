import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { ClientEntity } from './client.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ClientEntity,
    ]),
  ],
  providers: [ClientService],
  exports: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
