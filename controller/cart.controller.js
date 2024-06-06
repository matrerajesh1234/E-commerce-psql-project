import { BadRequestError } from "../error/custom.error.handler.js";
import {
  cartServices,
  productServices,
  userServices,
} from "../services/index.js";
import { sendResponse } from "../utils/services.js";

export const addToCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  try {
    const checkExistsCart = await cartServices.getCartItem(
      req.user.id,
      productId
    );

    if (checkExistsCart.length > 0) {
      const updateCartItem = await cartServices.updateCartItem(
        req.user.id,
        productId,
        quantity
      );
    } else {
      const addProduct = await cartServices.addCartItem(
        req.user.id,
        productId,
        quantity
      );
    }

    return sendResponse(res, 200, "Product added to cart successfully");
  } catch (error) {
    next(error);
  }
};

export const cartList = async (req, res, next) => {
  try {
    const listCart = await cartServices.getUserCartItems(req.user.id);
    if (!listCart) {
      throw new BadRequestError("No items in the cart");
    }
    return sendResponse(res, 200, "cart items", listCart);
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const checkCartItem = await cartServices.getUserCartItems(req.user.id);

    if (checkCartItem.length == 0) {
      throw new BadRequestError("Your cart is currently empty");
    }

    const removeItems = await cartServices.clearUserCart(req.user.id);
    return sendResponse(res, 200, "Cart cleared successfully");
  } catch (error) {
    next(error);
  }
};

export const editCart = async (req, res, next) => {
  try {
    const checkExistsCart = await cartServices.getCartItem(
      req.user.id,
      req.params.id
    );

    if (checkExistsCart.length === 0) {
      throw new BadRequestError("Item not found in cart");
    }

    const editCartItem = await cartServices.removeCartItem(
      req.user.id,
      req.params.id
    );
    return sendResponse(res, 400, "Cart removed successfully");
  } catch (error) {
    next(error);
  }
};
