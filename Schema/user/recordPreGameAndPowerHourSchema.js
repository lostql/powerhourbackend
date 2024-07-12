const { z } = require("zod");

const participantsSchema = z.object({
  name: z.string().trim().min(1, "name is required"),
  points: z
    .number({ message: "points must be of type number" })
    .min(10, "minimum points must be atleast 10"),
  isOut: z.boolean({
    required_error: "isOut is required",
    invalid_type_error: "isOut must be a boolean",
  }),
});

const recordPreGameAndPowerHourSchema = z.object({
  gameId: z
    .number({ message: "game id must be of type number" })
    .min(1, "Invalid game id, it cannot be less than 1"),
  participants: z.array(participantsSchema).min(2, {
    message: "there must be atleast 2 participants to record the game score",
  }),
});

module.exports = recordPreGameAndPowerHourSchema;
