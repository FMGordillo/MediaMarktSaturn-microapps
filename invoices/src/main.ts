import { NestFactory } from '@nestjs/core';
import { InvoicesModule } from './invoices.module';
import { MQ_CONFIGURATION_REGISTER } from './config/constants';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(
    InvoicesModule,
    MQ_CONFIGURATION_REGISTER.INVOICES,
  );
  await app.listen();
}
bootstrap();
