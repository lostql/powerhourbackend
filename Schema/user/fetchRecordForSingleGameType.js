const { z } = require("zod");

const fetchSingleGameTypeRecordSchema = z.object({
  gameTypeId: z.coerce
    .number({ message: "game type id must be a number" })
    .min(1, "game type id cannot be less than 1"),
});

module.exports = fetchSingleGameTypeRecordSchema;
