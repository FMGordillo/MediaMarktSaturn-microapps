import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { MQ_CONFIGURATION_REGISTER } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    OrdersModule,
	MQ_CONFIGURATION_REGISTER.ORDERS
  );
  await app.listen();
}
bootstrap();
