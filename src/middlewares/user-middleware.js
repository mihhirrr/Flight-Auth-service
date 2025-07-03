const { StatusCodes } = require('http-status-codes');
const zod = require('zod');

const { Error } = require('../utils/common-utils');

// Zod schema
const userInputSchema = zod.object({
  email: zod
    .string()
    .email("Invalid email format"),

  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long"),

  DoB: zod
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Date of Birth must be a valid date",
    }),
});

// Middleware for user authentication validation
const Auth = async (req, res, next) => {
  const { email, password, DoB } = req.body;

  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      ...Error,
      error: "Email and Password are required",
    });
  }

  // Validate input using Zod schema
  const validationResult = userInputSchema.safeParse({ email, password, DoB });

  if (!validationResult.success) {
    const formattedErrors = validationResult.error.errors.map((err) => ({
      field: err.path[0],
      message: err.message,
    }));

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
      ...Error,
      message: "Unable to create user!",
      error: formattedErrors,
    });
  }

  next();
};

module.exports = {
  Auth
}