const { logger } = require("../configs/logger.config");
const transporter = require("../configs/nodemailer.config");
const jwt = require("jsonwebtoken");

class Utils {
  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static verifyOTP(requestOTP, otp, createdAt) {
    const now = new Date();
    const created_at = new Date(createdAt);
    const timeDiffSeconds = Math.floor((now - created_at) / 1000);
    return requestOTP == otp && timeDiffSeconds <= 70;
  }

  static async sendMail(reciever, subject, text, html = null) {
    try {
      await transporter.sendMail({
        from: process.env.DEV_EMAIL_USER,
        to: reciever,
        subject: subject,
        text: text,
        html: `<b>${text}</b>`,
      });
    } catch (error) {
      console.error(error, "error sending email");
    }
  }

  static generateToken(payload) {
    try {
      return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "2d",
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Utils;
