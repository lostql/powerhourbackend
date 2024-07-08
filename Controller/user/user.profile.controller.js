const prisma = require("../../configs/prisma.config");
const { ConflictError } = require("../../customError");
const { handleOK } = require("../../responseHandlers/responseHandler");
const Utils = require("../../utils/globalUtils");

class UserProfileController {
  static async createProfile(req, res, next) {
    try {
      let token = null;

      const {
        firstName,
        lastName,
        dob,
        gender,
        address,
        phoneNumber,
        email,
        authProvider,
        city,
        state,
      } = req.body;
      const existUser = await prisma.user.findFirst({
        where: {
          OR: [
            {
              email,
            },
            {
              phoneNumber,
            },
          ],
        },
      });

      if (existUser) {
        throw new ConflictError(
          "User already exists with this email or phone number"
        );
      }

      const user = await prisma.user.create({
        data: {
          authProvider,
          firstName,
          lastName,
          dob,
          gender,
          address,
          phoneNumber,
          email,
          city,
          state,
        },
      });
      token = Utils.generateToken({ userId: user.id });
      handleOK(res, 200, user, "Profile Created Successfully", token);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserProfileController;
