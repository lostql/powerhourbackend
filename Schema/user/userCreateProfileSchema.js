const { z } = require("zod");
const { AuthProviders } = require("../../utils/constants");

const createUserProfileSchema = z.object({
  firstName: z
    .string()
    .min(4, "first name must be of atleast 4 characters")
    .max(100, "first name cannot be of more than 100 characters"),
  lastName: z
    .string()
    .min(5, "first name must be of atleast 4 characters")
    .max(100, "last name cannot be of more than 100 characters"),
  dob: z.string().nonempty("date of birth cannot be empty"),
  address: z.string().max(100, "address cannot be of more than 100 characters"),
  city: z.string().nonempty({ message: "city cannot be empty" }),
  state: z.string().nonempty({ message: "state cannot be empty" }),
  email: z.string().email("Invalid email format"),
  gender: z.enum(["male", "female"]),
  phoneNumber: z.string(),
  authProvider: z.enum(Object.keys(AuthProviders)),
});

module.exports = createUserProfileSchema;
