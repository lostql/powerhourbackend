const { z } = require("zod");

const participantSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Participant name must be at least 3 characters long" })
    .max(100, {
      message: "Participant name cannot be more than 100 characters",
    }),
  points: z
    .number({ message: "Participant score must be of type number" })
    .min(1, { message: "Invalid score, score cannot be less than 1" }),
});

const recordGameParticipantsAndPointSchema = z.object({
  gameId: z
    .number({ message: "game id must be of type number" })
    .min(1, "Invalid game id, it cannot be less than 1"),
  participants: z.array(participantSchema).min(2, {
    message:
      "At least two participants should participate to record the game score",
  }),
});

module.exports = recordGameParticipantsAndPointSchema;
