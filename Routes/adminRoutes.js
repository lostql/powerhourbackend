const adminAppController = require("../Controller/admin/admin.app.controller");
const adminAuthController = require("../Controller/admin/admin.auth.controller");
const { verifyAdminToken } = require("../Middlewares/adminAuthMiddleware");
const { validateSchema } = require("../Middlewares/validateSchema");
const changePasswordSchema = require("../Schema/admin/changePasswordSchema");
const loginSchema = require("../Schema/admin/loginSchema");

const adminRoutes = require("express").Router();

/********************************************************ADMIN AUTH ROUTES ************************************************/
adminRoutes.post(
  "/login",
  validateSchema(loginSchema),
  adminAuthController.login
);

adminRoutes.post(
  "/change-password",
  verifyAdminToken,
  validateSchema(changePasswordSchema),
  adminAuthController.changePassword
);

/*********************************************************ADMIN APP SETTINGS ROUTES*****************************************/
adminRoutes.patch(
  "app-settings/:id",
  verifyAdminToken,
  adminAppController.updateAppSettings
);
adminRoutes.get(
  "/app-settings",
  verifyAdminToken,
  adminAppController.getAppSettings
);

module.exports = adminRoutes;
