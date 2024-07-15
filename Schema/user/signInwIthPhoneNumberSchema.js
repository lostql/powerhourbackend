const { z } = require("zod");

const signInWithPhoneNumberSchema = z.object({
  phoneNumber: z.string().trim().min(1, "phone number is required"),
});

module.exports = signInWithPhoneNumberSchema;
