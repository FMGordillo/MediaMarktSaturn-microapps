import {
  Controller,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { MQ_CONFIGURATION_REGISTER, MQ_TOPICS } from '../config/constants';

@Controller('invoices')
export class InvoicesController {
  @Client(MQ_CONFIGURATION_REGISTER.INVOICES as any)
  client: ClientProxy;

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
