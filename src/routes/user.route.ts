import express, { IRouter } from 'express';
import userController from '../controllers/user.controller';
import userValidator from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';

class UserRoutes {

  private UserController = new userController();
  private router = express.Router();
  private UserValidator = new userValidator();

  
  constructor() {
    this.routes();
  }

  private routes = () => {

//////////////////////////////////////////////////////////////////////

    //route to create a new user
    this.router.post(
      '/',
      this.UserValidator.newUserValidator,
      this.UserController.newUser
    );

    this.router.post(
      '/login',
      this.UserValidator.loginUserValidator,
      this.UserController.userLogin
    );

 //route to get new access token using refresh token
 this.router.post('/refreshtoken',this.UserController.refreshToken);

/////////////////////////////////////////////////////////////////////////

// forget password
  this.router.post('/forgotpassword',this.UserController.forgotPass);
  
//route for reset password
  this.router.post('/resetpassword',userAuth,this.UserController.resetPass);







////////////////////////////////////////////////////////////////////////

    // //route to update a user by their id
    // this.router.put('/:id', this.UserController.updateUser);

    // //route to delete a user by their id
    // this.router.delete('/:id', this.UserController.deleteUser);
  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
