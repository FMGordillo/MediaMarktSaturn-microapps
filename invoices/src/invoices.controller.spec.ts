import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { MQ_SERVICES } from './config/constants';
import { ClientProxy } from '@nestjs/microservices';
import { getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { Order } from './commons/entities/order.entity';
import { Invoice } from './commons/entities/invoice.entity';

jest.mock('multer-gridfs-storage');

describe('InvoicesController', () => {
  let invoiceModel: any = new Invoice();
  let orderModel: any = new Order();
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
          useValue: invoiceModel,
        },
        {
          provide: getModelToken(Order.name),
          useValue: orderModel,
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
  });
});
