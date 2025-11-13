import httpStatus from 'http-status';


export const validate = (schema, property = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[property], { stripUnknown: true });
  
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: error.message });
  }

  Object.assign(req[property], value);
  next();
};