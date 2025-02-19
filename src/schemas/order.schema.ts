import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Recipe', required: false })
  recipeId: string;

  @Prop({
    required: true,
    enum: ['SOLICITADA', 'PENDIENTE', 'EN_PROCESO', 'COMPLETADO'],
  })
  status: string;

  @Prop()
  createdAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
