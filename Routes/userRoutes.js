const UserAuthController = require("../Controller/user/user.auth.controller");
const UserGameController = require("../Controller/user/user.game.controller");
const UserProfileController = require("../Controller/user/user.profile.controller");
const { verifyToken } = require("../Middlewares/authMiddleware");
const upload = require("../Middlewares/multerMiddleware");
const { validateSchema } = require("../Middlewares/validateSchema");
const { validateParams } = require("../Middlewares/validateParams");
const recordGameParticipantsAndPointSchema = require("../Schema/user/recordGameParticipantsAndPoints");
const startGameSchema = require("../Schema/user/startGameSchema");
const createUserProfileSchema = require("../Schema/user/userCreateProfileSchema");
const fetchSingleGameTypeRecordSchema = require("../Schema/user/fetchRecordForSingleGameType");
const socialLoginSchema = require("../Schema/user/socialLoginSchema");
const recordPreGameAndPowerHourSchema = require("../Schema/user/recordPreGameAndPowerHourSchema");

const userRouter = require("express").Router();

userRouter.post("/sign-in/email", UserAuthController.signInWithEmail);

userRouter.post("/sign-in/phone", UserAuthController.signInWithPhone); //todo will use twilio

userRouter.post(
  "/sign-in/google",
  validateSchema(socialLoginSchema),
  UserAuthController.signInWithGoogle
);

userRouter.post(
  "/sign-in/facebook",
  validateSchema(socialLoginSchema),
  UserAuthController.signInWithFacebook
);

userRouter.post("/verify-otp", UserAuthController.verifyOTP);

//resend OTP
userRouter.post("/resend-otp", UserAuthController.resendOTP);

/********************************************************PROFILE ROUTES***********************************************/
userRouter.post(
  "/create-profile",
  upload.single("profile_picture"),
  validateSchema(createUserProfileSchema),
  UserProfileController.createProfile
);

userRouter.get("/get-profile", verifyToken, UserProfileController.getMe);

/*******************************************************USER GAME ROUTES************************************************/
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

//route for storing participants and winners for pre and power hour game
userRouter.post(
  "/store-game-record/power-prehour-silenthour",
  verifyToken,
  validateSchema(recordPreGameAndPowerHourSchema),
  UserGameController.recordPreGamePowerHourAndSilentHour
);

//fetch
userRouter.get(
  "/fetch-single-game/participants/:gameTypeId",
  verifyToken,
  validateParams(fetchSingleGameTypeRecordSchema),
  UserGameController.fetchRecordForSingleGameType
);

module.exports = userRouter;
