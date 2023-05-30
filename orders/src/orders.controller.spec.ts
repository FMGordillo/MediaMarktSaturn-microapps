import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { MQ_SERVICES } from './config/constants';
import { getModelToken } from '@nestjs/mongoose';
import { Order } from './commons/entities/order.entity';
import { ClientProxy } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './commons/dto/create-order.dto';

const mockImplementation = {
  create: jest
    .fn()
    .mockImplementation((data: any) =>
      Promise.resolve({ _id: 'an uuid', ...data }),
    ),
  find: jest.fn().mockResolvedValue([]),
  findById: jest.fn().mockImplementation((id: string) =>
    Promise.resolve({
      _id: id,
      status: 'CREATED',
    }),
  ),
  findByIdAndUpdate: jest
    .fn()
    .mockImplementation((id: string, data: any, options: any) =>
      Promise.resolve({ _id: id, ...data }),
    ),
};

class MockClass {
  constructor(_data: CreateOrderDto) {}

  static create(data: any) {
    return mockImplementation.create(data);
  }

  static find() {
    return mockImplementation.find();
  }

  static findById(id: string) {
    return mockImplementation.findById(id);
  }

  static findByIdAndUpdate(id: string) {
    return mockImplementation.findByIdAndUpdate(id);
  }
}

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        OrdersService,
        {
          provide: MQ_SERVICES.ORDERS,
          useValue: {
            emit: jest.fn(),
            send: jest.fn(),
          },
        },
        {
          provide: getModelToken(Order.name),
          useFactory: () => MockClass,
        },
      ],
    }).compile();

    ordersController = app.get<OrdersController>(OrdersController);
    clientProxyMock = app.get(MQ_SERVICES.ORDERS);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(ordersController).toBeDefined();
    });

    it('should GET all orders', async () => {
      const response = await ordersController.findAll();
      expect(response).toStrictEqual([]);
    });

    it('should GET an order by specific id', async () => {
      const response = await ordersController.find({ id: '123' });
      expect(response).toStrictEqual({
        _id: '123',
        status: 'CREATED',
      });
    });

    it('should POST an order', async () => {
      const response = await ordersController.create({});
      expect(response).toStrictEqual({
        _id: 'an uuid',
      });
    });

    it('should PATCH an order', async () => {
      const response = await ordersController.update({
        _id: '123',
        updateOrderDto: {},
      });
      expect(response).toStrictEqual({
        _id: '123',
      });
    });
  });
});
