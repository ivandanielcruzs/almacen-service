import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IngredientDocument = Ingredient & Document;

@Schema({ timestamps: true })
export class Ingredient {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true, type: Number, default: 0 })
  stock: number;
}

export const IngredientSchema = SchemaFactory.createForClass(Ingredient);
