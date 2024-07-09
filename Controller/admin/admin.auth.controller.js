const prisma = require("../../configs/prisma.config");
const { NotFoundError, BadRequestError } = require("../../customError");
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
      const token = Utils.generateToken({ role: "admin", adminId: admin.id });
      const data = Utils.serializeAdmin(admin);
      handleOK(res, 200, data, "Successfully logged in", token);
    } catch (error) {
      next(error);
    }
  }
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body;
      const id = req.user.id;
      const admin = await prisma.admin.findFirst({
        where: {
          id,
        },
      });
      const isPassword = bcrypt.compareSync(oldPassword, admin.password);
      if (!isPassword) {
        throw new BadRequestError("Incorrect old password");
      }

      const newHashPassword = bcrypt.hashSync(newPassword, 10);
      await prisma.admin.update({
        where: {
          id,
        },
        data: {
          password: newHashPassword,
        },
      });
      handleOK(res, 200, null, "Password updated Successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = adminAuthController;
