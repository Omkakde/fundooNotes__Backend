/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';

import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

 
  public newUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.newUser(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'User created successfully'
      });
    } catch (error) {
      next(error);
    }
  };


  public refreshToken = async(req:Request, res:Response, next: NextFunction)=>{
    try{
      await this.UserService.refreshToken(req, res);
    }
    catch(error){
      next(error);
    }
  }

  
  //login
  public userLogin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.userLogin(req.body);
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        data: data,
        message: 'Login successfully'
      });
    } catch (error) {
      next(error);
    }
  };











  
  // /**
  //  * Controller to update a user
  //  * @param  {object} Request - request object
  //  * @param {object} Response - response object
  //  * @param {Function} NextFunction
  //  */
  // public updateUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> => {
  //   try {
  //     const data = await this.UserService.updateUser(req.params.id, req.body);
  //     res.status(HttpStatus.ACCEPTED).json({
  //       code: HttpStatus.ACCEPTED,
  //       data: data,
  //       message: 'User updated successfully'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  // /**
  //  * Controller to delete a user
  //  * @param  {object} Request - request object
  //  * @param {object} Response - response object
  //  * @param {Function} NextFunction
  //  */
  // public deleteUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<any> => {
  //   try {
  //     await this.UserService.deleteUser(req.params.id);
  //     res.status(HttpStatus.OK).json({
  //       code: HttpStatus.OK,
  //       data: {},
  //       message: 'User deleted successfully'
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // };
}

export default UserController;
