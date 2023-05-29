import {
  Controller,
  Inject,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { MQ_SERVICES, MQ_TOPICS } from '../config/constants';

@Controller('invoices')
export class InvoicesController {
  constructor(@Inject(MQ_SERVICES.INVOICES) private client: ClientProxy) {};

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@Query('orderId') orderId: string, @UploadedFile() file: any) {
    if (!orderId) {
      throw new Error('orderId is required in query');
    }
    return this.client.send(MQ_TOPICS.CREATE_INVOICE, {
      orderId,
      file: file.buffer.toString(),
    });
  }
}
