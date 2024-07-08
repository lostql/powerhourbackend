const prisma = require("../configs/prisma.config");
const { UnauthorizedError } = require("../customError");
const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthorizedError("Please login to continue");
      }

      const token = authHeader.split("Bearer ")[1];
      const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await prisma.user.findFirst({
        where: { id: data.userId },
      });

      if (!user) {
        throw new UnauthorizedError("Please login to continue");
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new UnauthorizedError("Please login to continue"));
      } else {
        next(error);
      }
    }
  },
};
