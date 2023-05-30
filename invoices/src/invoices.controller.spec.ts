import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MQ_SERVICES } from './config/constants';
import { ClientProxy } from '@nestjs/microservices';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Order } from './commons/entities/order.entity';
import { Invoice } from './commons/entities/invoice.entity';

jest.mock('multer-gridfs-storage');

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
  constructor(_data: any) {}

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

describe('InvoicesController', () => {
  let invoicesController: InvoicesController;
  let clientProxyMock: ClientProxy;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        InvoicesService,
        {
          provide: MQ_SERVICES.INVOICES,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: getModelToken(Invoice.name),
          useFactory: () => MockClass,
        },
        {
          provide: getModelToken(Order.name),
          useFactory: () => MockClass,
        },
        {
          provide: getConnectionToken(''),
          useValue: '',
        },
      ],
    }).compile();

    invoicesController = app.get<InvoicesController>(InvoicesController);
    clientProxyMock = app.get(MQ_SERVICES.INVOICES);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(invoicesController).toBeDefined();
    });

    it('should POST an invoice', async () => {
      const response = await invoicesController.create({
        orderId: '123',
        file: '',
      });
      expect(response).toStrictEqual({});
    });
  });
});
