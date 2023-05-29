import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { Client, ClientProxy } from '@nestjs/microservices';
import { CreateOrderDto } from '../commons/dto/create-order.dto';
import { UpdateOrderDto } from '../commons/dto/update-order.dto';
import { MQ_CONFIGURATION_REGISTER, MQ_TOPICS } from '../config/constants';

@Controller('orders')
export class OrdersController {
  @Client(MQ_CONFIGURATION_REGISTER.ORDERS as any)
  client: ClientProxy;

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
