const { z } = require("zod");

const getUserProfileSchema = z.object({
  id: z.coerce.number({ message: "id must be a number" }).min(1, "Invalid id"),
});

module.exports = getUserProfileSchema;
