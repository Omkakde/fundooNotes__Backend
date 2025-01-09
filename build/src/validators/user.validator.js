"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("@hapi/joi"));
// add data
class UserValidator {
    constructor() {
        this.newUserValidator = (req, res, next) => {
            const schema = joi_1.default.object({
                firstName: joi_1.default.string().min(4).required(),
                lastName: joi_1.default.string().min(4).required(),
                email: joi_1.default.string().email().required(),
                password: joi_1.default.string()
                    .pattern(new RegExp('^[a-zA-Z0-9]{4,30}$'))
                    .required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                next(error);
            }
            next();
        };
        this.loginUserValidator = (req, res, next) => {
            const schema = joi_1.default.object({
                email: joi_1.default.string().min(3).required(),
                password: joi_1.default.string().min(3).required()
            });
            const { error } = schema.validate(req.body);
            if (error) {
                next(error);
            }
            next();
        };
    }
}
exports.default = UserValidator;
