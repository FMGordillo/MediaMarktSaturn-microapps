import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './commons/entities/invoice.entity';
import { Order, OrderSchema } from './commons/entities/order.entity';
import { MONGODB_URI, MQ_CONFIGURATION_REGISTER } from './config/constants';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
	ConfigModule.forRoot(),
	// @ts-ignore
	ClientsModule.register([MQ_CONFIGURATION_REGISTER.INVOICES]),
    MongooseModule.forRoot(MONGODB_URI),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
