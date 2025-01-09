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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./../../../src/routes/user.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/v1/users', new user_route_1.default().getRoutes());
describe('User Routes API Tests', () => {
    // Test for user registration
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const userData = {
            firstName: 'user2',
            lastName: 'user2',
            email: 'user2@example.com',
            password: 'password123'
        };
        const response = yield (0, supertest_1.default)(app).post('/api/v1/users').send(userData);
        expect(response.body).toHaveProperty('message', 'Registration successful');
    }));
    // Test for user login
    it('should log in the user', () => __awaiter(void 0, void 0, void 0, function* () {
        const loginData = {
            email: 'user1@example.com',
            password: 'user123'
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/users/login')
            .send(loginData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('accessToken');
    }));
    // Test for refresh token
    it('should refresh the token', () => __awaiter(void 0, void 0, void 0, function* () {
        const refreshData = {
            refreshtoken: 'newToken'
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/users/refreshtoken')
            .send(refreshData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('newToken');
    }));
    // Test for forgot password
    it('should send password reset token to email', () => __awaiter(void 0, void 0, void 0, function* () {
        const emailData = {
            email: 'user1@example.com'
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/users/forgotpassword')
            .send(emailData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'token sent to mail');
    }));
    // Test for reset password
    it('should reset the user password', () => __awaiter(void 0, void 0, void 0, function* () {
        const resetData = {
            newPassword: 'Password123'
        };
        const validToken = 'validAccessTokenHere';
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/users/resetpassword')
            .set('Authorization', `Bearer ${validToken}`)
            .send(resetData);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'your password has been reset');
    }));
});
