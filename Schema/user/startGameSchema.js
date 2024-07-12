const { z } = require("zod");

const participantsSchema = z.object({
  name: z.string().trim().min(1, "name is required of participant"),
});

const startGameSchema = z.object({
  gameTypeId: z.coerce
    .number({ message: "game id must be of type number" })
    .min(1, "Invalid game id, it cannot be less than 1"),
  participants: z
    .array(participantsSchema)
    .min(2, "Atleast there should be 2 participants to start the game"),
});

module.exports = startGameSchema;
