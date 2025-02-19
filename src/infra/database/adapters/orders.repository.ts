import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../interfaces/orders.repository';
import { InjectModel } from '@nestjs/mongoose';
import { OrderDocument, Order } from 'src/schemas/order.schema';
import { Model } from 'mongoose';

@Injectable()
export class MongoOrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
  ) {}

  async updateOrder(id: string, update: object): Promise<boolean> {
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true },
    );
    return order ? true : false;
  }
}
