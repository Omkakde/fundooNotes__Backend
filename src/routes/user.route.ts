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
 /**
     * @openapi
     * /api/v1/users/:
     *   post:
     *     tags:
     *       - User
     *     summary: register
     *     description: Allows a user to register.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               firstName:
     *                 type: string
     *                 example: user1
     *               lastName:
     *                 type: string
     *                 example: user1
     *               email:
     *                 type: string
     *                 example: "user1@example.com"
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: user.username registered successfully!.
     *       400:
     *         description: user already exist.
     */
    this.router.post(
      '/',
      this.UserValidator.newUserValidator,
      this.UserController.newUser
    );

      /**
     * @openapi
     * /api/v1/users/login:
     *   post:
     *     tags: 
     *        - User
     *     summary: login
     *     description: Allows a user to login.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: "user1@example.com"
     *               password:
     *                 type: string
     *                 example: "password123"
     *     responses:
     *       200:
     *         description: User logged in successfully.
     *       400:
     *         description: Invalid email or Invalid email or password.
     */
    this.router.post(
      '/login',
      this.UserValidator.loginUserValidator,
      this.UserController.userLogin
    );

  /**
     * @openapi
     * /api/v1/users/refreshtoken:
     *   post:
     *     tags: 
     *        - User
     *     summary: refresh token
     *     description: Allows a user get new access token.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshtoken:
     *                 type: string
     *                 example: ""
     *     responses:
     *       200:
     *         description: newToken:"<token>".
     *       400:
     *         description: refreshtoken required or token not found in database.
     */
 this.router.post('/refreshtoken',this.UserController.refreshToken);

/////////////////////////////////////////////////////////////////////////

// forget password
  /**
     * @openapi
     * /api/v1/users/forgotpassword:
     *   post:
     *     tags: 
     *        - User
     *     summary: forgot password
     *     description: Allows a user get access token in mail.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *                 example: "user1@example.com"
     *     responses:
     *       200:
     *         description: token sent to mail.
     *       400:
     *         description: user not found.
     */
this.router.post('/forgotpassword',this.UserController.forgotPass);
  
//route for reset password
   /**
     * @openapi
     * /api/v1/users/resetpassword:
     *   post:
     *     tags: 
     *        - User
     *     summary: reset password
     *     description: Allows a user to reset password through access token from mail.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               newPassword:
     *                 type: string
     *                 example: "user123"
     *     responses:
     *       200:
     *         description: your password has been reset.
     *       400:
     *         description: could not update password.
     */
  this.router.post('/resetpassword',userAuth,this.UserController.resetPass);

  };

  public getRoutes = (): IRouter => {
    return this.router;
  };
}

export default UserRoutes;
