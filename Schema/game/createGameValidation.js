const { z } = require("zod");

const createGameSchema = z.object({
  type: z
    .string()
    .min(3, "type should be of atleast 3 characers")
    .max(20, "type cannot be of more than 20 characters"),
  duration: z.string().min(3, "duration must be of atleast 5 characers"),
});

module.exports = createGameSchema;
