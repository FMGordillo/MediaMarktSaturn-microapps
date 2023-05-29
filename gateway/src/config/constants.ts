import { Transport } from '@nestjs/microservices';

export const MONGODB_URI = process.env.MONGODB_URI;
export const INVOICE_BUCKET_FILES = 'invoice_files';

export const MQ_SERVICES = {
  ORDERS: 'ORDERS_SERVICE',
  INVOICES: 'INVOICES_SERVICE',
} as const;

export const MQ_TOPICS = {
  CREATE_ORDER: 'order.create',
  GET_ORDER: 'order.get',
  LIST_ORDERS: 'order.list',
  UPDATE_ORDER: 'order.update',
  CREATE_INVOICE: 'invoice.update',
  SEND_INVOICE: 'invoice.send',
} as const;

export const MQ_CONFIGURATION_REGISTER: Record<keyof typeof MQ_SERVICES, any> =
  {
    ORDERS: {
      name: MQ_SERVICES.ORDERS,
      transport: Transport.TCP,
      options: { host: 'orders', port: 3001 },
    },
    INVOICES: {
      name: MQ_SERVICES.INVOICES,
      transport: Transport.TCP,
      options: { host: 'invoices', port: 3002 },
    },
  };
