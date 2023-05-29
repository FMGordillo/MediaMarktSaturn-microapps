import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from '@nestjs/microservices';
import { MQ_CONFIGURATION_REGISTER } from './config/constants';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      MQ_CONFIGURATION_REGISTER.ORDERS,
      MQ_CONFIGURATION_REGISTER.INVOICES,
    ]),
    OrdersModule,
    InvoicesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
