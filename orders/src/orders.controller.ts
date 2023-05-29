import { Controller, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import {
  MQ_SERVICES,
  MQ_TOPICS,
} from './config/constants';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './commons/dto/create-order.dto';
import { UpdateOrderDto } from './commons/dto/update-order.dto';

@Controller()
export class OrdersController {
  constructor(
    private readonly orderService: OrdersService,
    @Inject(MQ_SERVICES.ORDERS) private client: ClientProxy,
  ) {}

  @EventPattern(MQ_TOPICS.CREATE_ORDER)
  create(data: CreateOrderDto) {
    return this.orderService.create(data);
  }

  @EventPattern(MQ_TOPICS.GET_ORDER)
  find({ id }: { id: string }) {
    return this.orderService.find(id);
  }

  @EventPattern(MQ_TOPICS.LIST_ORDERS)
  findAll() {
    return this.orderService.findAll();
  }

  @EventPattern(MQ_TOPICS.UPDATE_ORDER)
  async update({
    _id,
    updateOrderDto,
  }: {
    _id: string;
    updateOrderDto: UpdateOrderDto;
  }) {
    const response = await this.orderService.update(_id, updateOrderDto);

    this.client.emit(MQ_TOPICS.SEND_INVOICE, {
      invoiceId: response.get('invoiceId'),
    });

    return response;
  }
}
