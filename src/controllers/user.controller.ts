/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpStatus from 'http-status-codes';
import userService from '../services/user.service';

import { Request, Response, NextFunction } from 'express';

class UserController {
  public UserService = new userService();

 
  // new user controller
  public newUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await this.UserService.newUser(req.body);
      
      res.status(HttpStatus.CREATED).json({
        code: HttpStatus.CREATED,
        message: `registered Successfully!`
      });
    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${error}`});
    
    
    }
  };


  // refresh token controller
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
      
      res.status(HttpStatus.OK).json({
        code: HttpStatus.OK,
        data: data,
        message: 'Login successfully'
        });

    } catch (error) {
      res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        
        message: `${error}`})
    
    }
  };
 

  
  public forgotPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.UserService.forgotPassword(req.body);
      res.status(200).json({
        message: 'token sent to mail'
      });
    } catch (error) {
      next(error);
    }
  };

  public resetPass = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.UserService.resetPassword(req.body);
      res.status(200).json({
        message: 'your password has been reset'
      });
    } catch (error) {
      next(error);
    }
  };






}

export default UserController;
