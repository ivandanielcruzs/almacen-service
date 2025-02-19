import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PurchaseDocument,
  Purchase as PurchaseDB,
} from 'src/schemas/purchase.schema';
import { Model } from 'mongoose';
import { IPurchaseRepository } from '../interfaces/purchase.repository';
import { Purchase } from 'src/domain/purchase.domain';

@Injectable()
export class MongoPurchaseRepository implements IPurchaseRepository {
  constructor(
    @InjectModel(PurchaseDB.name)
    private readonly purchaseModel: Model<PurchaseDocument>,
  ) {}

  async create(purchaseData: Partial<Purchase>): Promise<void> {
    const purchase = new this.purchaseModel(purchaseData);
    await purchase.save();
  }
}
