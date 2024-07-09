const { z } = require("zod");

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters long")
  .regex(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must include at least one special character"
  );

const changePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(1, "old password is required"),
    newPassword: passwordSchema,
    newConfirmPassword: passwordSchema,
  })
  .superRefine(({ newPassword, newConfirmPassword }, ctx) => {
    if (newPassword !== newConfirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Both new passwords must be the same",
        path: ["newConfirmPassword"],
      });
    }
  });

module.exports = changePasswordSchema;
