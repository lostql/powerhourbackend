const googleClient = require("../../configs/googleAuth.config");
const prisma = require("../../configs/prisma.config");
const { BadRequestError, UnauthorizedError } = require("../../customError");
const { handleOK } = require("../../responseHandlers/responseHandler");
const { AuthProviders } = require("../../utils/constants");
const Utils = require("../../utils/globalUtils");
const axios = require("axios");

class UserAuthController {
  static async signInWithPhone(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      const existProfile = await prisma.user.findFirst({
        where: {
          AND: [
            {
              phoneNumber,
            },
            {
              authProvider: {
                in: [
                  AuthProviders.APPLE,
                  AuthProviders.EMAIL,
                  AuthProviders.GOOGLE,
                  AuthProviders.FACEBOOK,
                ],
              },
            },
          ],
        },
      });
      if (existProfile) {
        throw new BadRequestError(
          "This phone number is already associated with different signin method"
        );
      }
      const otp = Utils.generateOTP();
      const newPhoneOTP = await prisma.userOtp.upsert({
        where: {
          phoneNumber,
        },
        create: {
          otp,
          phoneNumber,
        },
        update: {
          otp,
          isUsed: false,
        },
      });
      await Utils.sendMessage(
        phoneNumber,
        `Welcome to PowerHour, Your verification OTP is ${newPhoneOTP.otp}`
      );
      handleOK(res, 200, null, "An OTP has been sent your phone number");
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

  static async signInWithGoogle(req, res, next) {
    try {
      const { token } = req.body;
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.OAUTH_GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload.email) {
        throw new Error("Something went wrong try again please");
      }

      const existProfileWithEmail = await prisma.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (existProfileWithEmail) {
        const token = Utils.generateToken({ userId: existProfileWithEmail.id });
        handleOK(
          res,
          200,
          { profile: existProfileWithEmail },
          "Successfully sign up",
          token
        );
      } else {
        handleOK(
          res,
          200,
          { authProvider: AuthProviders.GOOGLE, email: payload.email },
          "Successfully authenticated with google, Now please create profile"
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async signInWithFacebook(req, res, next) {
    try {
      const { token } = req.body;
      const response = await axios.get(
        `https://graph.facebook.com/me?access_token=${token}&fields=email`
      );
      const { email } = response.data;
      if (!email) {
        throw new Error("Something went wrong");
      }

      const existProfileWithEmail = await prisma.user.findFirst({
        where: {
          email,
        },
      });
      if (existProfileWithEmail) {
        const token = Utils.generateToken({ userId: existProfileWithEmail.id });
        handleOK(
          res,
          200,
          { profile: existProfileWithEmail },
          "Successfully sign up",
          token
        );
      } else {
        handleOK(
          res,
          200,
          { authProvider: AuthProviders.FACEBOOK, email },
          "Successfully authenticated with Facebook,Now please create Profile"
        );
      }
    } catch (error) {
      if (error?.response?.data?.error?.code == 190) {
        next(new UnauthorizedError("Error verifying token"));
      }
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
              authProvider: AuthProviders.EMAIL,
              email: providerValue,
            },
          });
        }

        if (key == AuthProviders.PHONE_NUMBER) {
          existingProfileWithPhone = await prisma.user.findFirst({
            where: {
              authProvider: AuthProviders.PHONE,
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
