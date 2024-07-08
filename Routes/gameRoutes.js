const GameDetailsController = require("../Controller/game/game.details.controller");
const upload = require("../Middlewares/multerMiddleware");
const validateSchema = require("../Middlewares/validateSchema");
const createGameSchema = require("../Schema/game/createGameValidation");

const gameRouter = require("express").Router();

gameRouter.get("/", GameDetailsController.fetchAllGames);
gameRouter.post(
  "/create-game",
  upload.single("game_image"),
  validateSchema(createGameSchema),
  GameDetailsController.createGame
);

module.exports = gameRouter;
