const UserAuthController = require("../Controller/user/user.auth.controller");
const UserGameController = require("../Controller/user/user.game.controller");
const UserProfileController = require("../Controller/user/user.profile.controller");
const { verifyToken } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/multerMiddleware");
const validateSchema = require("../Middlewares/validateSchema");
const recordGameParticipantsAndPointSchema = require("../Schema/user/recordGameParticipantsAndPoints");
const startGameSchema = require("../Schema/user/startGameSchema");
const createUserProfileSchema = require("../Schema/user/userCreateProfileSchema");

const userRouter = require("express").Router();

userRouter.post("/sign-in/email", UserAuthController.signInWithEmail);

userRouter.post("/sign-in/phone", UserAuthController.signInWithPhone); //todo will use twilio

userRouter.post("/verify-otp", UserAuthController.verifyOTP);

//resend OTP
userRouter.post("/resend-otp", UserAuthController.resendOTP);

userRouter.post(
  "/create-profile",
  upload.single("profile_picture"),
  validateSchema(createUserProfileSchema),
  UserProfileController.createProfile
);

//start game route
userRouter.post(
  "/start-game",
  verifyToken,
  validateSchema(startGameSchema),
  UserGameController.startGame
);

//fetch games played by user
userRouter.get(
  "/fetch-games",
  verifyToken,
  UserGameController.fetchGamesPlayedByUsers
);

//game completed-record points and participants route
userRouter.post(
  "/store-game-record",
  verifyToken,
  validateSchema(recordGameParticipantsAndPointSchema),
  UserGameController.recordPartcipantsAndWinners
);

//fetch
userRouter.get(
  "/fetch-single-game/participants",
  verifyToken,
  UserGameController.fetchRecordForSingleGameType
);

module.exports = userRouter;
