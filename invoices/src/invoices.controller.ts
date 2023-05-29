import { Controller } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import {
  MQ_CONFIGURATION_REGISTER,
  MQ_TOPICS,
  STORAGE_CLIENT,
} from './config/constants';
import { Client, ClientProxy, EventPattern } from '@nestjs/microservices';
import { Types } from 'mongoose';
import { Readable } from 'stream';
import { InjectConnection } from '@nestjs/mongoose';

@Controller()
export class InvoicesController {
  constructor(
    private readonly invoiceService: InvoicesService,
    @InjectConnection() private readonly db: any,
  ) {}

  @Client(MQ_CONFIGURATION_REGISTER.INVOICES as any)
  client: ClientProxy;

  // TODO: Improve types
  @EventPattern(MQ_TOPICS.CREATE_INVOICE)
  async create(data: { orderId: string; file: any }) {
    try {
      const buffer = Buffer.from(data.file);
      const readable = new Readable();
      readable._read = () => {};
      readable.push(buffer);
      const fileId = new Types.ObjectId();
      const writeStream = STORAGE_CLIENT(this.db).openUploadStreamWithId(
        fileId,
        'invoice',
      );
      readable.pipe(writeStream);

      const response = await this.invoiceService.create({
        orderId: data.orderId,
        file: fileId,
      });
      this.client.emit(MQ_TOPICS.SEND_INVOICE, response);
      return response;
    } catch (error) {
      throw new Error(error);
    }
  }

  @EventPattern(MQ_TOPICS.SEND_INVOICE)
  async send({ _id, invoiceId }: { _id?: string; invoiceId?: string }) {
    const invoiceToCheck = _id || invoiceId;

    if (!invoiceToCheck) return;
    const invoice = await this.invoiceService.findById(invoiceToCheck);

    if (!invoice || invoice.get('orderId.status') !== 'SHIPPED') {
      return;
    } else {
      await this.invoiceService.update({
        _id: invoice._id,
        timestamp: new Date().toISOString(),
      });
    }

    return invoice;
  }
}
