import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type Status =
  | 'CREATED'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'SHIPPING'
  | 'SHIPPED';

@Schema()
export class Order {
  @Prop()
  id: string;

  @Prop()
  status: Status;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop()
  productId: string;

  @Prop()
  customerId: string;

  @Prop()
  sellerId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' })
  invoiceId: string;
}

export type OrderDocument = HydratedDocument<Order>;

export const OrderSchema = SchemaFactory.createForClass(Order);
