import { Ingredient } from 'src/domain/ingredient.domain';
import { IIngredientsRepository } from '../interfaces/ingredients.repository';
import { Injectable } from '@nestjs/common';
import {
  IngredientDocument,
  Ingredient as IngredientDB,
} from 'src/schemas/ingredient.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MongoIngredientsRepository implements IIngredientsRepository {
  constructor(
    @InjectModel(IngredientDB.name)
    private readonly ingredientModel: Model<IngredientDocument>,
  ) {}

  async getListIngredients(ingredientsIds: string[]): Promise<Ingredient[]> {
    const listIngredients = await this.ingredientModel
      .find({ _id: { $in: ingredientsIds } })
      .exec();
    return listIngredients.map(
      ({ id, stock, name }) => new Ingredient(id as string, name, stock),
    );
  }

  async updateStockIngredient(
    idIngredient: string,
    amount: number,
  ): Promise<boolean> {
    const order = await this.ingredientModel.findByIdAndUpdate(
      idIngredient,
      { $inc: { stock: Math.floor(amount) } },
      { new: true },
    );
    return order ? true : false;
  }
}
