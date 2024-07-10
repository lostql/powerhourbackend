const { z } = require("zod");

const socialLoginSchema = z.object({
  token: z.string().trim().min(1, "token is required"),
});

module.exports = socialLoginSchema;
