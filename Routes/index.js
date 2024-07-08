const { handleError } = require("../responseHandlers/responseHandler");
const gameRouter = require("./gameRoutes");
const userRoutes = require("./userRoutes");
const rootRouter = require("express").Router();

rootRouter.use("/user", userRoutes);
rootRouter.use("/game", gameRouter);
rootRouter.all("*", (req, res) => {
  handleError(res, 404, null, "Route Not Found");
});

module.exports = rootRouter;
