import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './commons/entities/order.entity';
import { MONGODB_URI, MQ_CONFIGURATION_REGISTER } from './config/constants';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
	// @ts-ignore
    ClientsModule.register([MQ_CONFIGURATION_REGISTER.ORDERS]),
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
