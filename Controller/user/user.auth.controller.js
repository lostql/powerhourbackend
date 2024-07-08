const prisma = require("../../configs/prisma.config");
const { BadRequestError } = require("../../customError");
const { handleOK } = require("../../responseHandlers/responseHandler");
const { AuthProviders } = require("../../utils/constants");
const Utils = require("../../utils/globalUtils");

class UserAuthController {
  static async signInWithPhone() {
    try {
      //TODO
      //will use twilio
    } catch (error) {
      next(error);
    }
  }

  static async signInWithEmail(req, res, next) {
    try {
      const newOTP = Utils.generateOTP();
      const { email } = req.body;
      const userOtp = await prisma.userOtp.upsert({
        where: {
          email,
        },
        update: {
          isUsed: false,
          otp: newOTP,
        },
        create: {
          email,
          otp: newOTP,
        },
      });
      handleOK(res, 200, null, "An OTP code has been sent to your email");
      await Utils.sendMail(
        userOtp.email,
        "OTP VERIFICATION CODE",
        `Enter this OTP to verify your account ${userOtp.otp}`
      );
    } catch (error) {
      next(error);
    }
  }

  static async verifyOTP(req, res, next) {
    try {
      const { key, providerValue, otp } = req.body;

      let token = null;
      let profile = null;
      let existingProfileWithEmail = null;
      let existingProfileWithPhone = null;

      let whereClause = {
        otp,
        isUsed: false,
      };

      if (key == AuthProviders.PHONE_NUMBER) {
        whereClause.phoneNumber = providerValue;
      }
      if (key == AuthProviders.EMAIL) {
        whereClause.email = providerValue;
      }

      const existOTP = await prisma.userOtp.findFirst({
        where: whereClause,
      });

      if (!existOTP) {
        throw new BadRequestError("Invalid OTP");
      }

      if (Utils.verifyOTP(otp, existOTP.otp, existOTP.updatedAt)) {
        await prisma.userOtp.update({
          where: whereClause,
          data: {
            isUsed: true,
          },
        });

        //if otp is verified then check if profile is created or not if created then just throw the user in profile object
        if (key == AuthProviders.EMAIL) {
          existingProfileWithEmail = await prisma.user.findFirst({
            where: {
              email: providerValue,
            },
          });
        }

        if (key == AuthProviders.PHONE_NUMBER) {
          existingProfileWithPhone = await prisma.user.findFirst({
            where: {
              phoneNumber: providerValue,
            },
          });
        }

        //check if profile exists with any provider then generate token;
        profile = existingProfileWithEmail ?? existingProfileWithPhone;
        if (profile) {
          token = Utils.generateToken({ userId: profile.id });
        }
        handleOK(res, 200, { profile }, "OTP verified", token);
      } else {
        throw new BadRequestError("OTP Expired,Please try again");
      }
    } catch (error) {
      next(error);
    }
  }

  static async resendOTP(req, res, next) {
    try {
      const { key, providerValue } = req.body;
      let whereClause = {};
      if (key == AuthProviders.PHONE_NUMBER) {
        whereClause.phoneNumber = providerValue;
      }
      if (key == AuthProviders.EMAIL) {
        whereClause.email = providerValue;
      }
      if (key == AuthProviders.FACEBOOK) {
        whereClause.facebookId = providerValue;
      }
      if (key == AuthProviders.GOOGLE) {
        whereClause.googleId = providerValue;
      }
      if (key == AuthProviders.APPLE) {
        whereClause.appleId = providerValue;
      }

      const OTP = Utils.generateOTP();

      const newOTP = await prisma.userOtp.update({
        where: whereClause,
        data: {
          isUsed: false,
          otp: OTP,
        },
      });

      handleOK(res, 200, null, `A new otp has been sent to your ${key}`);
      await Utils.sendMail(
        newOTP.email,
        "OTP VERIFICATION CODE",
        `Enter this OTP to verify your account ${newOTP.otp}`
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserAuthController;
