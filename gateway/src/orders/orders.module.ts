import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { ClientsModule } from '@nestjs/microservices';
import { MQ_CONFIGURATION_REGISTER } from 'src/config/constants';

@Module({
  imports: [ClientsModule.register([MQ_CONFIGURATION_REGISTER.ORDERS])],
  controllers: [OrdersController],
})
export class OrdersModule {}
