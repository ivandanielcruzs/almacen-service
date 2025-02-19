import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PurchaseDocument = Purchase & Document;

@Schema({ timestamps: true })
export class Purchase {
  @Prop({ type: Types.ObjectId, ref: 'Ingredient', required: true })
  ingredientId: string;

  @Prop({ required: true })
  quantity: number;

  @Prop()
  orderedAt: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
