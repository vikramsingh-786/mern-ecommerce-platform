import { validationResult } from 'express-validator';

const validateRequest = (schema) => async (req, res, next) => {
  await Promise.all(schema.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array().map(err => ({ field: err.param, message: err.msg })) });
  }

  next();
};

export default validateRequest;
