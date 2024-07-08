const adminAppController = require("../Controller/admin/admin.app.controller");
const adminAuthController = require("../Controller/admin/admin.auth.controller");
const { validateSchema } = require("../Middlewares/validateSchema");
const loginSchema = require("../Schema/admin/loginSchema");

const adminRoutes = require("express").Router();

adminRoutes.post(
  "/login",
  validateSchema(loginSchema),
  adminAuthController.login
);

adminRoutes.patch("app-settings/:id", adminAppController.updateAppSettings);
adminRoutes.get("/app-settings", adminAppController.getAppSettings);

module.exports = adminRoutes;
