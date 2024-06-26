import { BadRequestError } from "../error/custom.error.handler.js";
import {
  cartServices,
  categoryServices,
  productServices,
  userServices,
} from "../services/index.js";
import { sendResponse } from "../utils/services.js";

export const addToCart = async (req, res, next) => {
  const { productId, categoryId, quantity } = req.body;
  try {
    const checkProductExists = await productServices.getProducts({
      id: productId,
    });

    if (!checkProductExists) {
      throw new BadRequestError("Product is not found");
    }

    const checkCategoryExists = await categoryServices.getCategories({
      id: categoryId,
    });

    if (checkCategoryExists.length == 0) {
      throw new BadRequestError("Category is not found");
    }

    const checkExistsCart = await cartServices.getCartItem(
      req.user.id,
      productId
    );
    console.log(checkExistsCart);

    if (checkExistsCart.length > 0) {
      const updateCartItem = await cartServices.updateCartItem(
        req.user.id,
        productId,
        categoryId,
        quantity
      );
    } else {
      const addProduct = await cartServices.addCartItem(
        req.user.id,
        productId,
        categoryId,
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

    const totalCartAmount = await cartServices.totalCartCount(listCart);

    return sendResponse(res, 200, "cart items", totalCartAmount);
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
    console.log(checkExistsCart);
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
