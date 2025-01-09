"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = __importDefault(require("../services/user.service"));
class UserController {
    constructor() {
        this.UserService = new user_service_1.default();
        // new user controller
        this.newUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.newUser(req.body);
                res.status(http_status_codes_1.default.CREATED).json({
                    code: http_status_codes_1.default.CREATED,
                    message: `registered Successfully!`
                });
            }
            catch (error) {
                res.status(http_status_codes_1.default.BAD_REQUEST).json({
                    code: http_status_codes_1.default.BAD_REQUEST,
                    message: `${error}`
                });
            }
        });
        // refresh token controller
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.UserService.refreshToken(req, res);
            }
            catch (error) {
                next(error);
            }
        });
        //login
        this.userLogin = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.UserService.userLogin(req.body);
                res.status(http_status_codes_1.default.OK).json({
                    code: http_status_codes_1.default.OK,
                    data: data,
                    message: 'Login successfully'
                });
            }
            catch (error) {
                res.status(http_status_codes_1.default.BAD_REQUEST).json({
                    code: http_status_codes_1.default.BAD_REQUEST,
                    message: `${error}`
                });
            }
        });
        this.forgotPass = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.UserService.forgotPassword(req.body);
                res.status(200).json({
                    message: 'token sent to mail'
                });
            }
            catch (error) {
                next(error);
            }
        });
        this.resetPass = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.UserService.resetPassword(req.body);
                res.status(200).json({
                    message: 'your password has been reset'
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UserController;
