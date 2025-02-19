import { Ingredient } from 'src/domain/ingredient.domain';

export interface IIngredientsRepository {
  getListIngredients(ingredientsIds: string[]): Promise<Ingredient[]>;
  updateStockIngredient(idIngredient: string, amount: number): Promise<boolean>;
}
