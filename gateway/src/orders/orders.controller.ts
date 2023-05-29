import { Controller, Get, Post, Body, Patch, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from '../commons/dto/create-order.dto';
import { UpdateOrderDto } from '../commons/dto/update-order.dto';
import { MQ_SERVICES, MQ_TOPICS } from '../config/constants';

@Controller('orders')
export class OrdersController {
  constructor(@Inject(MQ_SERVICES.ORDERS) private client: ClientProxy) {};

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send(MQ_TOPICS.CREATE_ORDER, createOrderDto);
  }

  @Get()
  findAll() {
    return this.client.send(MQ_TOPICS.LIST_ORDERS, {});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.client.send(MQ_TOPICS.GET_ORDER, { id });
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.client.send(MQ_TOPICS.UPDATE_ORDER, { _id, updateOrderDto });
  }
}
