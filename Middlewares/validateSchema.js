const { ZodError } = require("zod");
const { ValidationError } = require("../customError");

const formatZodErrors = (zodError) => {
  const formattedErrors = zodError.issues.map((issue) => {
    return {
      path: issue.path.join("."),
      message: issue.message,
    };
  });

  return formattedErrors;
};

const validateSchema = (schema) => {
  return (req, res, next) => {
    let dataToValidate;
    if (req.is("multipart/form-data")) {
      dataToValidate = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => [key, value])
      );
    } else if (req.is("application/json")) {
      dataToValidate = req.body;
    }
    try {
      schema.parse(req.body);
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

module.exports = { validateSchema, formatZodErrors };
