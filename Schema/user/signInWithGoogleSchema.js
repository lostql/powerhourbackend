const { z } = require("zod");

const signInWithGoogleSchema = z.object({
  token: z.string().trim().min(1, "token is required"),
});

module.exports = signInWithGoogleSchema;
