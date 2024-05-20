import Joi from "joi";

export const categorySchemas = {
  body: {
    validCategoryName: Joi.object().keys({
      categoryName: Joi.string().required().messages({
        "string.empty": "Category name cannot be empty",
        "any.required": "Category name is required",
      }),
    }),
  },
  params: {
    validCategoryId: Joi.object().keys({
      id: Joi.string().required().messages({
        "string.empty": "Category name cannot be empty", // id remove(rajesh) 
        "any.required": "Category name is required",
      }),
    }),
  },
};
