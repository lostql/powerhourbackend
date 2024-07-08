const prisma = require("../../configs/prisma.config");
const { handleOK } = require("../../responseHandlers/responseHandler");

class adminAppController {
  static async updateAppSettings(req, res, next) {
    try {
      const { id } = req.params;
      const { privacyPolicy, aboutApp, termsAndConditions } = req.body;
      await prisma.appSettings.update({
        where: {
          id: Number(id),
        },
        data: {
          privacyPolicy,
          aboutApp,
          termsAndConditions,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAppSettings(req, res, next) {
    try {
      const appSettings = await prisma.appSettings.findFirst();
      handleOK(res, 200, appSettings, "App Settings fetched Successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = adminAppController;
