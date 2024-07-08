const { handleError } = require("../responseHandlers/responseHandler");
const adminRoutes = require("./adminRoutes");
const gameRouter = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const rootRouter = require("express").Router();

rootRouter.use("/admin", adminRoutes);
rootRouter.use("/game", gameRouter);
rootRouter.use("/user", userRoutes);
rootRouter.all("*", (req, res) => {
  handleError(res, 404, null, "Route Not Found");
});

module.exports = rootRouter;
