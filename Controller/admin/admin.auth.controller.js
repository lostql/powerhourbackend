const prisma = require("../../configs/prisma.config");
const { NotFoundError } = require("../../customError");
const bcrypt = require("bcryptjs");
const Utils = require("../../utils/globalUtils");
const { handleOK } = require("../../responseHandlers/responseHandler");

class adminAuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const admin = await prisma.admin.findFirst({
        where: {
          email,
        },
      });

      if (!admin) {
        throw new NotFoundError("Wrong Credentials");
      }

      const isPassword = bcrypt.compareSync(password, admin.password);
      if (!isPassword) {
        throw new NotFoundError("Wrong Crendtials");
      }
      const token = Utils.generateToken({ role: "admin", id: admin.id });
      const data = Utils.serializeAdmin(admin);
      handleOK(res, 200, data, "Successfully logged in", token);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = adminAuthController;
