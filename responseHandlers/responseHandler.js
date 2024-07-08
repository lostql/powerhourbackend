module.exports = {
  handleOK(res, status, data, message, token = null) {
    return res.status(status).json({
      success: true,
      data,
      message,
      token,
    });
  },
  handleError(
    res,
    status = 500,
    data = null,
    message = "Something went wrong"
  ) {
    return res.status(status).json({
      success: false,
      data,
      message,
    });
  },
};
