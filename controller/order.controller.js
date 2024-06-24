import { orderServices } from "../services/index.js";
import { cartServices } from "../services/index.js";
import { couponServices } from "../services/index.js";
import { BadRequestError } from "../error/custom.error.handler.js";
import { sendResponse } from "../utils/services.js";

export const orderPlace = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cartItems = await cartServices.getUserCartItems(userId);
    if (cartItems.length === 0) {
      throw new BadRequestError("Cart items not found");
    }

    const orderTotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    // Initialize variables for coupon discount
    let discountApplied = 0;
    let discountedTotal = orderTotal;

    // Check if coupon code is provided in request body
    if (req.body.couponCode) {
      const couponCode = req.body.couponCode;

      // Check if coupon is valid
      const coupon = await couponServices.isCouponValid(couponCode);
      if (!coupon) {
        throw new BadRequestError("Invalid or expired coupon");
      }

      // Check if coupon applies to current order
      const restrictions = await couponServices.getCoupon(coupon.id);
      if (
        restrictions &&
        !couponServices.validateCouponRestrictions(
          coupon,
          restrictions,
          cartItems,
          orderTotal
        )
      ) {
        throw new BadRequestError(
          "Coupon is not applicable to the current order"
        );
      }

      // Apply coupon discount
      const discountResult = couponServices.applyDiscount(orderTotal, coupon);
      discountApplied = discountResult.discountApplied;
      discountedTotal = discountResult.discountedTotal;

      // Log coupon usage
      await couponServices.recordCouponUsage(coupon.id, userId);
      // Update coupon quantity
      await couponServices.updateQuantity(coupon.id);
    }

    // Calculate final shipping cost
    const finalShippingCost = Number(
      req.body.shippingCost ? req.body.shippingCost : 0
    );

    // Calculate grand total
    const grandTotal = discountedTotal + finalShippingCost;
    // Create order in database

    const [order] = await orderServices.orderCreateService(
      userId,
      orderTotal,
      discountApplied,
      discountedTotal,
      finalShippingCost,
      grandTotal,
      "Pending",
      req.body.shippingAddress
    );

    for (const item of cartItems) {
      await orderServices.orderItemService(
        order.id,
        item.productId,
        item.productName,
        item.price,
        item.quantity,
        item.price * item.quantity
      );
    }

    await cartServices.clearUserCart(userId);

    // Return response with order details
    return sendResponse(res, 200, "Order place successfully", order);
  } catch (error) {
    next(error);
  }
};

export const getOrderList = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming userId is retrieved from the request

    const orders = await orderServices.getOrderListService(userId);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};
