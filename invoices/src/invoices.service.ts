import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateInvoiceDto } from './commons/dto/create-invoice.dto';
import { Invoice } from './commons/entities/invoice.entity';
import { Order } from './commons/entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Order.name) private orderModel: Model<Order>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    await this.invoiceModel.create(createdInvoice);

    await this.orderModel.findOneAndUpdate(createdInvoice.get('orderId'), {
      $set: { invoiceId: createdInvoice._id },
    });

    return createdInvoice;
  }

  update(updateInvoiceDto: any) {
    return this.invoiceModel.updateOne(
      { _id: updateInvoiceDto._id },
      updateInvoiceDto,
    );
  }

  findById(id: string) {
    return this.invoiceModel.findById(id, {}, { populate: 'orderId' });
  }
}
