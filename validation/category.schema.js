import Joi from "joi";
export const categorySchemas = {
  body: Joi.object().keys({
    categoryName: Joi.string().required().messages({
      "string.empty": "Category name cannot be empty",
      "any.required": "Category name is required",
    }),
  }),
  params: Joi.object().keys({
    id: Joi.string().required().messages({
      "string.empty": "Category Id cannot be empty",
      "any.required": "Category Id is required",
    }),
  }),
};
