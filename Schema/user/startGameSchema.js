const { z } = require("zod");

const startGameSchema = z.object({
  gameTypeId: z
    .number({ message: "game id must be of type number" })
    .min(1, "Invalid game id, it cannot be less than 1"),
});

module.exports = startGameSchema;
