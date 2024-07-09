const prisma = require("../configs/prisma.config");
const { UnauthorizedError } = require("../customError");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyAdminToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Please login to continue");
      }

      const token = authHeader.split("Bearer ")[1];
      const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const admin = await prisma.admin.findFirst({
        where: {
          id: data.adminId,
        },
      });
      if (!admin || data.role != "admin") {
        throw new UnauthorizedError("Please login to continue");
      }
      req.user = admin;
      next();
    } catch (error) {
      next(error);
    }
  },
};
