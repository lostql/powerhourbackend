const prisma = require("../../configs/prisma.config");
const { ConflictError, NotFoundError } = require("../../customError");
const { handleOK } = require("../../responseHandlers/responseHandler");
const Utils = require("../../utils/globalUtils");

class UserProfileController {
  static async createProfile(req, res, next) {
    try {
      let imageUrl = null;
      let token = null;

      if (req.file) {
        imageUrl = await Utils.handleS3Upload(
          req.file.path,
          req.file.filename,
          req.file.mimetype,
          "user"
        );
      }

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
          imageUrl,
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

  static async getMe(req, res, next) {
    try {
      const profile = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
        select: {
          firstName: true,
          lastName: true,
          dob: true,
          city: true,
          state: true,
          address: true,
        },
      });
      handleOK(res, 200, profile, "User Profile");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserProfileController;
