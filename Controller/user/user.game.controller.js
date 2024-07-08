const prisma = require("../../configs/prisma.config");
const { handleOK } = require("../../responseHandlers/responseHandler");

class UserGameController {
  static async startGame(req, res, next) {
    try {
      const userId = req.user.id;
      const { gameTypeId } = req.body;
      const newUserGame = await prisma.userGameRecord.create({
        data: {
          gameTypeId,
          createdBy: userId,
        },
      });
      handleOK(res, 200, newUserGame, "Game created Successfully");
    } catch (error) {
      next(error);
    }
  }

  static async recordPartcipantsAndWinners(req, res, next) {
    try {
      const { participants, gameId } = req.body;
      const participantData = participants.map((participant) => ({
        ...participant,
        gameId,
      }));
      console.log(participantData);
      const gameParticipants = await prisma.gameParticipant.createMany({
        data: participantData,
      });
      handleOK(
        res,
        200,
        gameParticipants,
        "Game Participants Recorded Successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  static async fetchGamesPlayedByUsers(req, res, next) {
    try {
      const userId = req.user.id;
      const gamesPlayedByUser = await prisma.userGameRecord.findMany({
        where: {
          createdBy: userId,
        },
        select: {
          Game: {
            select: {
              id: true,
              type: true,
              duration: true,
              imageUrl: true,
            },
          },
        },
        distinct: ["gameTypeId"],
      });
      const data = gamesPlayedByUser.map((item) => item.Game);
      handleOK(res, 200, data, "Games Fetched Played By User");
    } catch (error) {
      next(error);
    }
  }

  static async fetchRecordForSingleGameType(req, res, next) {
    try {
      const { gameTypeId } = req.params;
      const gameRecords = await prisma.userGameRecord.findMany({
        where: {
          id: Number(gameTypeId),
          createdBy: req.user.id,
        },
        select: {
          createdAt: true,
          Game: {
            select: {
              duration: true,
              type: true,
            },
          },
          GameParticipant: {
            select: {
              name: true,
              points: true,
            },
          },
        },
      });

      handleOK(
        res,
        200,
        gameRecords,
        "Successfully Fetched Records for Single Game Type"
      );
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserGameController;
