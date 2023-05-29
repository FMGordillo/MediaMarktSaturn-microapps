import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { ClientsModule } from '@nestjs/microservices';
import { MQ_CONFIGURATION_REGISTER } from 'src/config/constants';

@Module({
  imports: [ClientsModule.register([MQ_CONFIGURATION_REGISTER.INVOICES])],
  controllers: [InvoicesController]
})
export class InvoicesModule {}
