import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { MQ_SERVICES, MQ_TOPICS } from '../config/constants';
import { ClientProxy } from '@nestjs/microservices';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: MQ_SERVICES.INVOICES,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    clientProxyMock = module.get(MQ_SERVICES.INVOICES);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call POST to Invoices microservice', () => {
    const file = {
      buffer: Buffer.from('test'),
    };

    controller.create('123', file);

    expect(clientProxyMock.send).toHaveBeenCalledWith(
      MQ_TOPICS.CREATE_INVOICE,
      {
        orderId: '123',
        file: file.buffer.toString(),
      },
    );
  });
});
