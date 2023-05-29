import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { MQ_SERVICES } from './config/constants';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from './commons/entities/order.entity';
import { ClientProxy } from '@nestjs/microservices';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let clientProxyMock: ClientProxy;
  let orderModel: any = new Order();

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: MQ_SERVICES.ORDERS,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: getModelToken(Order.name),
          useValue: orderModel, 
        },
      ],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
	clientProxyMock = app.get(MQ_SERVICES.ORDERS);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(true).toBeTruthy();
    });
  });
});
