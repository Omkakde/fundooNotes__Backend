"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const user_validator_1 = __importDefault(require("../validators/user.validator"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
class UserRoutes {
    constructor() {
        this.UserController = new user_controller_1.default();
        this.router = express_1.default.Router();
        this.UserValidator = new user_validator_1.default();
        this.routes = () => {
            //////////////////////////////////////////////////////////////////////
            /**
                * @openapi
                * /api/v1/users/:
                *   post:
                *     tags:
                *       - User
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
            this.router.post('/', this.UserValidator.newUserValidator, this.UserController.newUser);
            /**
           * @openapi
           * /api/v1/users/login:
           *   post:
           *     tags:
           *        - User
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
            this.router.post('/login', this.UserValidator.loginUserValidator, this.UserController.userLogin);
            /**
               * @openapi
               * /api/v1/users/refreshtoken:
               *   post:
               *     tags:
               *        - User
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
            this.router.post('/refreshtoken', this.UserController.refreshToken);
            /////////////////////////////////////////////////////////////////////////
            // forget password
            /**
               * @openapi
               * /api/v1/users/forgotpassword:
               *   post:
               *     tags:
               *        - User
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
            this.router.post('/forgotpassword', this.UserController.forgotPass);
            //route for reset password
            /**
              * @openapi
              * /api/v1/users/resetpassword:
              *   post:
              *     tags:
              *        - User
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
            this.router.post('/resetpassword', auth_middleware_1.userAuth, this.UserController.resetPass);
        };
        this.getRoutes = () => {
            return this.router;
        };
        this.routes();
    }
}
exports.default = UserRoutes;
