const prisma = require("../../configs/prisma.config");
const { ConflictError } = require("../../customError");
const { handleOK } = require("../../responseHandlers/responseHandler");

class GameDetailsController {
  static async fetchAllGames(req, res, next) {
    try {
      const games = await prisma.game.findMany({});
      handleOK(res, 200, games, "All Games fetched");
    } catch (error) {
      next(error);
    }
  }

  static async createGame(req, res, next) {
    try {
      const { type, duration } = req.body;
      const existGameWithSameType = await prisma.game.findFirst({
        where: {
          type,
        },
      });
      if (existGameWithSameType) {
        throw new ConflictError("Game of this type aleady exits");
      }
      const imageUrl = req.file.filename;
      const newGame = await prisma.game.create({
        data: {
          type,
          duration,
          imageUrl,
        },
      });
      handleOK(res, 200, newGame, "Game Created Successfully");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = GameDetailsController;
