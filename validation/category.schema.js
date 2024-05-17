import Joi from "joi";

export const categorySchemas = {
  body: {
    ValidCreateCategory: Joi.object().keys({
      categoryName: Joi.string().required().messages({
        "string.empty": "Category name cannot be empty",
        "any.required": "Please provide category name",
      }),
    }),
    ValidUpdateCategory: Joi.object().keys({
      categoryName: Joi.string().required().messages({
        "string.empty": "Category name cannot be empty",
        "any.required": "Category name is required",
      }),
    }),
    
  },
  params: {
    ValidCategoryId: Joi.object().keys({
      id: Joi.string().required().messages({
        "string.empty": "Category id cannot be empty",
        "any.required": "Category id is required",
      }),
    }),
  },
};
