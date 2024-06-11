import { sendResponse } from "../utils/services.js";

import { cartServices, couponServices } from "../services/index.js";
import {
  BadRequestError,
  NotFoundError,
} from "../error/custom.error.handler.js";
import pool from "../config/database.js";

export const createCoupon = async (req, res, next) => {
  try {
    const [checkCouponExists] = await couponServices.getCouponsService({
      code: req.body.code,
      name: req.body.name,
    });

    if (checkCouponExists) {
      throw new BadRequestError("Code already exists");
    }

    const createdCoupon = await couponServices.createCouponService(req.body);

    return sendResponse(res, 200, "Coupon Created Succesfully", createdCoupon);
  } catch (error) {
    next(error);
  }
};

export const listCoupon = async (req, res, next) => {
  try {
    const listData = await couponServices.getCouponsService();
    return sendResponse(res, 200, listData);
  } catch (error) {
    next(error);
  }
};

export const editCoupon = async (req, res, next) => {
  try {
    const editCoupon = await couponServices.getCouponsService({
      id: req.params.id,
    });
    if (!editCoupon) {
      throw new BadRequestError("Coupon not found");
    }
    return sendResponse(
      res,
      200,
      "Category details retrieved successfully",
      editCoupon
    );
  } catch (error) {
    next(error);
  }
};

export const updateCoupon = async (req, res, next) => {
  try {
    const [Coupon] = await couponServices.getCouponsService({
      id: req.params.id,
    });
    console.log(Coupon);
    if (!Coupon) {
      throw new BadRequestError("Coupon not found");
    }

    const [codeExists] = await couponServices.checkCouponCodeExist(
      {
        code: req.body.code,
      },
      req.params.id
    );

    if (codeExists) {
      return next(new BadRequestError("Code already exists"));
    }

    const updatecoupon = await couponServices.updateCouponService(
      {
        id: req.params.id,
      },
      req.body
    );
    return sendResponse(res, 200, "Coupon updated successfully");
  } catch (error) {}
};

export const deleteCoupon = async (req, res, next) => {
  try {
    const [Coupon] = await couponServices.getCouponsService({
      id: req.params.id,
    });

    if (!Coupon) {
      throw new NotFoundError("Coupon not found");
    }

    const deletedCoupon = await couponServices.updateCouponService(
      { id: req.params.id },
      { isDeleted: true, isActive: false },
      "and"
    );

    return sendResponse(res, 200, "Delete coupon successfully");
  } catch (error) {
    next(error);
  }
};

export const applyCoupon = async (req, res, next) => {
  const { couponCode } = req.body;
  try {
    const cartItems = await cartServices.getUserCartItems(req.user.id);
    if (cartItems.length === 0) {
      throw new BadRequestError("Cart item not found");
    }
    const orderTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const coupon = await couponServices.isCouponValid(couponCode);
    if (!coupon) {
      throw new BadRequestError("Invalid or expire coupon");
    }

    const { discountedTotal, discountApplied } = couponServices.applyDiscount(
      orderTotal,
      coupon
    );

    const finalShippingCost = Number(
      req.body.shippingCost ? req.body.shippingCost : 0
    );

    const decrementQuantity = await couponServices.updateQuantity(coupon.id);
    return sendResponse(res, 200, {
      originalTotal: orderTotal,
      discountApplied: discountApplied,
      discountedTotal: discountedTotal,
      shippingCost: finalShippingCost,
      GrandTotal: discountedTotal + finalShippingCost,
    });
  } catch (error) {
    next(error);
  }
};
