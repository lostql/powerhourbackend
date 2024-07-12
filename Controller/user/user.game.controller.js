const { logger } = require("../../configs/nodemailer.config");
const prisma = require("../../configs/prisma.config");
const { handleOK } = require("../../responseHandlers/responseHandler");
const Utils = require("../../utils/globalUtils");

class UserGameController {
  static async startGame(req, res, next) {
    try {
      const userId = req.user.id;
      const { gameTypeId, participants } = req.body;
      const newUserGame = await prisma.userGameRecord.create({
        data: {
          gameTypeId,
          createdBy: userId,
        },
      });
      handleOK(
        res,
        200,
        { gameId: newUserGame.id, participants },
        "Game created Successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  //api end point for pre game and power hour
  static async recordPreGameAndPowerHour(req, res, next) {
    try {
      const { participants, gameId, isCompleted } = req.body;
      if (isCompleted) {
        const participantData = participants.map((participant) => ({
          name: participant.name,
          points: participant.points,
          gameId,
        }));

        const winners = Utils.sortWinnersForPreAndPowerHourGame(
          participants,
          gameId
        );

        //creating participants and winners
        await prisma.$transaction([
          prisma.gameParticipant.createMany({
            data: participantData,
          }),
          prisma.gameWinner.createMany({
            data: winners,
          }),
        ]);

        const gameWinners = await prisma.gameWinner.findMany({
          where: {
            gameId,
          },
          select: {
            name: true,
            points: true,
          },
          orderBy: {
            points: "desc",
          },
        });
        handleOK(res, 200, gameWinners, "Game Successfully ended");
      } else {
        handleOK(
          res,
          200,
          null,
          "game not completed, No Participants and Winners recorded"
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async recordPartcipantsAndWinners(req, res, next) {
    try {
      const { participants, gameId, isCompleted } = req.body;
      //if game is completed then record the participants and winners.
      if (isCompleted) {
        //now game is completed means time is up and there were participants till the end
        //and we have to record participants and winners
        const participantData = participants.map((participant) => ({
          ...participant,
          gameId,
        }));
        const gameParticipants = await prisma.gameParticipant.createMany({
          data: participantData,
        });

        handleOK(
          res,
          200,
          gameParticipants,
          "Game Participants Recorded Successfully"
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async fetchGamesPlayedByUsers(req, res, next) {
    try {
      const userId = req.user.id;
      const gamesPlayedByUser = await prisma.userGameRecord.findMany({
        where: {
          isCompleted: true,
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
