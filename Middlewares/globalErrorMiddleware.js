const { handleError } = require("../responseHandlers/responseHandler");

const globalErrorMiddleware = (err, req, res,next) => {
  const statusCode = err.status ?? 500;
  const message = err.message ?? "Something went wrong";
  handleError(res, statusCode, null, message);
};

module.exports = {
  globalErrorMiddleware,
};
