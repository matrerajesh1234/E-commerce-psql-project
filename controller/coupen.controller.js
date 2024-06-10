import { sendResponse } from "../utils/services.js";

import { couponServices } from "../services/index.js";
import { BadRequestError } from "../error/custom.error.handler.js";

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
