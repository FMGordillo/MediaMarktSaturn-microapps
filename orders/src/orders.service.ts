import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateOrderDto } from './commons/dto/create-order.dto';
import { UpdateOrderDto } from './commons/dto/update-order.dto';
import { Order } from './commons/entities/order.entity';
import { Model } from 'mongoose';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  findAll() {
    return this.orderModel.find();
  }

  find(id: string) {
    return this.orderModel.findById(id);
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
  }
}
