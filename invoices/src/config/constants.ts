import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import mongoose from 'mongoose';
import { GridFsStorage } from 'multer-gridfs-storage';

export const MONGODB_URI = process.env.MONGODB_URI;
export const INVOICE_BUCKET_FILES = 'invoice_files';

export const STORAGE = new GridFsStorage({
  url: MONGODB_URI,
  file: (_req, file) => {
    return { bucket: INVOICE_BUCKET_FILES, filename: file.originalname };
  },
});

export const STORAGE_CLIENT = (db) => new mongoose.mongo.GridFSBucket(db);

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

export const MQ_CONFIGURATION_REGISTER: Record<
  keyof typeof MQ_SERVICES,
  MicroserviceOptions
> = {
  ORDERS: {
    transport: Transport.TCP,
    options: { host: 'orders', port: 3001 },
  } as const,
  INVOICES: {
    transport: Transport.TCP,
    options: { host: 'invoices', port: 3002 },
  } as const,
} as const;
