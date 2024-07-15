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

  //end point for pre game and power hour
  static async recordPreGamePowerHourAndSilentHour(req, res, next) {
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
          prisma.userGameRecord.update({
            where: {
              createdBy: req.user.userId,
              id: gameId,
            },
            data: {
              isCompleted: true,
            },
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

  //end point for increementing user completed games count
  //first achievement will be unlocked on 5 games and other than on 10 games
  static async updateOrCreateAchievements(req, res, next) {
    try {
      const userId = req.user.id;

      const completedGamesCount = await prisma.userGameRecord.count({
        where: {
          createdBy: userId,
          isCompleted: true,
        },
      });

      const achievements = await prisma.achievement.findMany({});
      let remainingGames = completedGamesCount;

      const calculateAchievementProgress = (threshold, remainingGames) => {
        if (remainingGames >= threshold) {
          remainingGames -= threshold;
          return { progress: 100, remainingGames };
        } else {
          const progress = (remainingGames / threshold) * 100;
          remainingGames = 0;
          return { progress, remainingGames };
        }
      };

      const progressResults = achievements.map((achievement) => {
        const { id, threshold, imageUrl, name } = achievement;
        const { progress, remainingGames: updatedRemainingGames } =
          calculateAchievementProgress(threshold, remainingGames);
        remainingGames = updatedRemainingGames;

        return { id, progress, imageUrl, name };
      });

      handleOK(res, 200, progressResults, "Achievements with progress fetched");
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

  //get all user achievements with progress
  static async getAllAchievements(req, res, next) {
    try {
      const userId = req.user.userId;
      const userAchievements = await prisma.achievement.findMany({
        where: {
          UserAchievement: {
            every: {
              id: userId,
            },
          },
        },
      });
      handleOK(res, 200, userAchievements, "success");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserGameController;
