import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { MQ_SERVICES, MQ_TOPICS } from '../config/constants';
import { ClientProxy } from '@nestjs/microservices';

describe('OrdersController', () => {
  let controller: OrdersController;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: MQ_SERVICES.ORDERS,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    clientProxyMock = module.get(MQ_SERVICES.ORDERS);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call POST to Orders microservice', () => {
    controller.create({});

    expect(clientProxyMock.send).toHaveBeenCalledWith(
      MQ_TOPICS.CREATE_ORDER,
      {},
    );
  });

  it('should call GET to Orders microservice', () => {
    controller.findAll();

    expect(clientProxyMock.send).toHaveBeenCalledWith(
      MQ_TOPICS.LIST_ORDERS,
      {},
    );
  });

  it('should call GET by id to Orders microservice', () => {
    controller.findOne('123');

    expect(clientProxyMock.send).toHaveBeenCalledWith(MQ_TOPICS.GET_ORDER, {
      id: '123',
    });
  });

  it('should call PATCH to Orders microservice', () => {
    controller.update('123', {});

    expect(clientProxyMock.send).toHaveBeenCalledWith(MQ_TOPICS.UPDATE_ORDER, {
      _id: '123',
      updateOrderDto: {},
    });
  });
});
