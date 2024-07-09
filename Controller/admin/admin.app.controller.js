const prisma = require("../../configs/prisma.config");
const { handleOK } = require("../../responseHandlers/responseHandler");
const Utils = require("../../utils/globalUtils");

class adminAppController {
  static async updateAppSettings(req, res, next) {
    try {
      const updateAppPayload = Utils.removeNullValuesFromObject(req.body);
      const updatedSettings = await prisma.appSettings.update({
        where: {
          id: Number(req.params.id),
        },
        data: updateAppPayload,
      });
      handleOK(res, 200, updatedSettings, "App Settings Updated Successfully");
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
