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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../models/index");
const mail_utils_1 = require("../utils/mail.utils");
class UserService {
    constructor() {
        // create new user
        this.newUser = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const exist = yield index_1.Users.findOne({ where: { email: body.email } });
                if (exist) {
                    throw new Error('User already exists');
                }
                body.password = yield bcrypt_1.default.hash(body.password, 10);
                const data = yield index_1.Users.create(body);
                if (!data) {
                    throw new Error('Registration failed');
                }
                return Object.assign(Object.assign({}, data.dataValues), { message: 'Registration successful' });
            }
            catch (error) {
                throw new Error(`Error during registration: ${error.message}`);
            }
        });
        //Refresh token
        this.refreshToken = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { refreshtoken } = req.body;
            if (!refreshtoken) {
                res.status(400).json({
                    message: "refreshtoken required"
                });
            }
            jsonwebtoken_1.default.verify(refreshtoken, process.env.JWT_SECRET_REFRESH, (error, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (error) {
                    res.status(404).json({
                        message: "invalid refreshtoken"
                    });
                }
                const user = yield index_1.Users.findOne({ where: { id: decoded.id, refreshToken: refreshtoken } });
                if (!user) {
                    res.status(404).json({
                        message: "refreshtoken not found in database"
                    });
                }
                const newToken = jsonwebtoken_1.default.sign({ email: decoded.email, id: decoded.id }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1h' });
                res.status(200).json({
                    newToken: newToken
                });
            }));
        });
        //Login
        this.userLogin = (body) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield index_1.Users.findOne({ where: { email: body.email } });
                if (!data) {
                    return {
                        message: 'User not found',
                    };
                }
                const match = yield bcrypt_1.default.compare(body.password, data.password);
                if (!match) {
                    return {
                        message: 'Invalid password',
                    };
                }
                const accessToken = jsonwebtoken_1.default.sign({ email: data.dataValues.email, id: data.dataValues.id }, process.env.JWT_SECRET_ACCESS, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
                const refreshToken = jsonwebtoken_1.default.sign({ email: data.dataValues.email, id: data.dataValues.id }, process.env.JWT_SECRET_REFRESH, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });
                yield index_1.Users.update({ refreshToken }, { where: { id: data.dataValues.id } });
                return {
                    accessToken,
                    refreshToken,
                    message: 'Login successful',
                };
            }
            catch (error) {
                throw new Error(`Error during login: ${error.message}`);
            }
        });
        //forgot password
        this.forgotPassword = ({ email }) => __awaiter(this, void 0, void 0, function* () {
            const user = yield index_1.Users.findOne({ where: { email } });
            if (!user) {
                throw Error('user not found');
            }
            const token = yield jsonwebtoken_1.default.sign({ userId: user.dataValues.id, email: user.dataValues.email }, process.env.JWT_SECRET_ACCESS, { expiresIn: '1d' });
            try {
                yield (0, mail_utils_1.sendPasswordResetToken)(`${user.dataValues.email}`, `${token}`);
            }
            catch (error) {
                throw error;
            }
        });
        //reset user password
        this.resetPassword = ({ newPassword, email }) => __awaiter(this, void 0, void 0, function* () {
            const password = yield bcrypt_1.default.hash(newPassword, 10);
            const update = yield index_1.Users.update({ password }, { where: { email } });
            if (!update) {
                throw Error('could not update password');
            }
        });
    }
}
exports.default = UserService;
