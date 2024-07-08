const { ZodError } = require("zod");
const { ValidationError } = require("../customError");
const { formatZodErrors } = require("./validateSchema");

const validateParams = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatZodErrors(error);
        const validationErrorInstance = new ValidationError(errors);
        next(validationErrorInstance);
      } else {
        next(error);
      }
    }
  };
};

module.exports = { validateParams };
