import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Order, OrderSchema } from './order.entity';

@Schema()
export class Invoice {
  @Prop()
  id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Prop()
  file: string;

  @Prop()
  timestamp: string;
}

export type OrderDocument = HydratedDocument<Invoice>;

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

/*
InvoiceSchema.pre<Invoice>('save', async function (next) {
  const order = mongoose.model(Order.name, OrderSchema);
  const haber = await order.findById(this.orderId);
  await order.findByIdAndUpdate(this.orderId, {
    $set: { invoiceId: this.id },
  });
  next();
});
*/
