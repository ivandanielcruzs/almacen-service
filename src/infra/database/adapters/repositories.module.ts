import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Ingredient, IngredientSchema } from 'src/schemas/ingredient.schema';
import { MongoIngredientsRepository } from './ingredients.repository';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Purchase, PurchaseSchema } from 'src/schemas/purchase.schema';
import { MongoOrderRepository } from './orders.repository';
import { MongoPurchaseRepository } from './purchase.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Ingredient.name, schema: IngredientSchema },
      { name: Purchase.name, schema: PurchaseSchema },
    ]),
  ],
  providers: [
    { provide: 'IIngredientRepository', useClass: MongoIngredientsRepository },
    { provide: 'IOrderRepository', useClass: MongoOrderRepository },
    { provide: 'IPurchaseRepository', useClass: MongoPurchaseRepository },
  ],
  exports: ['IIngredientRepository', 'IOrderRepository', 'IPurchaseRepository'],
})
export class RepositoriesModule {}
