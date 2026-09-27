// src/middlewares/validate.middleware.js
const { sendError } = require('../utils/response.util');

/**
 * Zod schema validation middleware
 * @param {import('zod').ZodSchema} schema
 * @param {'body'|'query'|'params'} source
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return sendError(res, 'Validation failed', 422, errors);
    }

    req[source] = result.data;
    next();
  };
};

module.exports = { validate };
