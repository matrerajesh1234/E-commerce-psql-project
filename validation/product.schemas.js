import Joi from "joi";

export const productSchemas = {
  body: {
    ValidCreateProduct: Joi.object().keys({
      productName: Joi.string().required().messages({
        "string.empty": "Product name cannot be empty",
        "any.required": "Product name is required",
      }),
      description: Joi.string().required().messages({
        "string.empty": "Description cannot be empty",
        "any.required": "Description is required",
      }),
      productDetails: Joi.string().required().messages({
        "string.empty": "Product details cannot be empty",
        "any.required": "Product details are required",
      }),
      price: Joi.number().required().messages({
        "number.base": "Price should be a number",
        "any.required": "Price is required",
      }),
      color: Joi.string().required().messages({
        "string.empty": "Color cannot be empty",
        "any.required": "Color is required",
      }),
      rating: Joi.number().precision(3).positive().optional().allow(null),
      reviews: Joi.number().integer().positive().optional().allow(null),
      brand: Joi.string().optional().allow(null),
      categoryId: Joi.array().required().messages({
        "array.base": "Category ID should be an array of valid ObjectIds",
        "any.required": "Category ID is required",
      }),
    }),
    ValidUpdateProduct: Joi.object().keys({
      productName: Joi.string().optional().messages({
        "any.required": "Product name is required",
      }),
      description: Joi.string().allow("").optional(),
      productDetails: Joi.string().allow("").optional(),
      price: Joi.number().messages({
        "any.required": "Price is required",
      }),
      color: Joi.string().messages({
        "any.required": "Color is required",
      }),
      isActive: Joi.boolean().optional(),
      isDeleted: Joi.boolean().optional(),
      createdAt: Joi.date().optional(),
      updatedAt: Joi.date().optional(),
      rating: Joi.number().optional().allow(null),
      reviews: Joi.number().optional().allow(null),
      brand: Joi.string().optional().allow(""),
    }),
  },
  params: {
    ValidProductId: Joi.object().keys({
      id: Joi.string().required().messages({
        "string.empty": "Product ID cannot be empty",
        "any.required": "Product ID is required",
      }),
    }),
  },
  query: {
    ValidListRequest: Joi.object().keys({
      search: Joi.string().optional().allow("").max(255).messages({
        "string.max": "Search query length should not exceed 255 characters",
      }),
      page: Joi.number().integer().positive().optional().messages({
        "number.integer": "Page number must be an integer",
        "number.positive": "Page number must be a positive integer",
      }),
      limit: Joi.number().integer().positive().optional().messages({
        "number.integer": "Limit must be an integer",
        "number.positive": "Limit must be a positive integer",
      }),
      sortBy: Joi.string().optional().allow("").max(255).messages({
        "string.max": "SortBy field length should not exceed 255 characters",
      }),
      sortOrder: Joi.string().valid("asc", "desc").optional().messages({
        "any.only": "SortOrder must be either 'asc' or 'desc'",
      }),
    }),
  },
  filesSchema: Joi.array().items(
    Joi.object().keys({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().required(),
    })
  ),
};
