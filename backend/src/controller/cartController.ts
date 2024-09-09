// backend/controllers/cartController.ts
import { Request, Response } from 'express';
import Cart from '../models/Cart';

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    // Recalculate total price (assume getProductPrice is a utility function)
    cart.totalPrice += await getProductPrice(productId);
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// Get user cart
export const getUserCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId == productId);

    if (itemIndex > -1) {
      const item = cart.items[itemIndex];
      cart.totalPrice -= await getProductPrice(item.productId) * item.quantity;
      cart.items.splice(itemIndex, 1);
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};

// Utility function (for example, fetching product price from DB)
const getProductPrice = async (productId: string): Promise<number> => {
  // Implement logic to get the price of the product
  return 100; // Replace with actual logic
};
