import Joi from '@hapi/joi';
import { Request, Response, NextFunction } from 'express';
// add data
class UserValidator {
  public  newUserValidator = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      firstName: Joi.string().min(4).required(),
      lastName: Joi.string().min(4).required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{4,30}$'))
        .required()

    });
    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
  


  public loginUserValidator  = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
      email: Joi.string().min(3).required(),
      password: Joi.string().min(3).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
      next(error);
    }
    next();
  };
}

export default UserValidator;
