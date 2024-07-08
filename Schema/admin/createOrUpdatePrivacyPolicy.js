const { z } = require("zod");

const createOrUpdatePrivacyPolicy = z.object({
  policy: z
    .string({ message: "Policy is required" })
    .min(50, { message: "Policy should be atleast 50 characters long" }),
});

module.exports = createOrUpdatePrivacyPolicy;
