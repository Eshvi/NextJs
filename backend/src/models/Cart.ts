// backend/models/Cart.ts
import mongoose, { Schema, Document } from 'mongoose';

interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartDocument extends Document {
  userId: string;
  items: CartItem[];
  totalPrice: number;
}

const CartSchema: Schema<CartDocument> = new Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
    },
  ],
  totalPrice: { type: Number, required: true, default: 0 },
});

const Cart = mongoose.model<CartDocument>('Cart', CartSchema);
export default Cart;
