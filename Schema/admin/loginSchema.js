const { z } = require("zod");

const loginSchema = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "please provide valid email" }),
  password: z
    .string()
    .trim()
    .min(1, { message: "Password cannot be left empty" }),
});

module.exports = loginSchema;
