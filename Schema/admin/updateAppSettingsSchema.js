const { z } = require("zod");

const updateAppSettingParamSchema = z.object({
  id: z.coerce.number({ message: "id must be a number" }).min(1, "Invalid id"),
});

const updateAppSettingSchema = z.object({
  aboutApp: z
    .string()
    .trim()
    .min(1, "about app cannot be an empty string")
    .optional()
    .nullable(),
  termsAndConditions: z
    .string()
    .trim()
    .min(1, "terms and conditions cannot be an empty string")
    .optional()
    .nullable(),
  privacyPolicy: z
    .string()
    .trim()
    .min(1, "privacy policy cannot be an empty string")
    .optional()
    .nullable(),
});

module.exports = {
  updateAppSettingParamSchema,
  updateAppSettingSchema,
};
