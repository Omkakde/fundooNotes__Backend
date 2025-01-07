/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let Bearer = req.header('Authorization');
    if (!Bearer)
      throw {
        code: HttpStatus.BAD_REQUEST,
        message: 'Authorization token is required'
      };
   
    const { id, email }: any = await jwt.verify(Bearer,`${process.env.JWT_SECRET_ACCESS}`);
    req.body.createdBy = id; 
    req.body.email = email;
  //  res.locals.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
