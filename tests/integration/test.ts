
import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/index';
describe('Routes', () => {
  let server: any;
  before(async () => {
    server = await app.startApp();
  });
  after(() => {
    server.close();
  });
  // Register User Test
  //it('should register a new user', async () => {
  //   const response = await request(app.getApp())
  //     .post('/api/v1/users/')
  //     .send({
  //       firstName: 'testuser',
  //       lastName:"testuser",
  //       email: 'testuser@example.com',
  //       password: 'testpassword123',
  //     });
  //   expect(response.status).to.equal(201);
  //   expect(response.body).to.have.property('message').that.includes('registered Successfully!');
  // });

  let accessToken;
  let refreshToken;
  // Login User Test
  it('should login a user', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/users/login')
      .send({
        email: 'user1@example.com',
        password: 'user123',
      });
    accessToken = response.body.data.accessToken;
    refreshToken = response.body.data.refreshToken;
    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.property('accessToken');
  });

  // Refresh Token Test
  it('should refresh user token', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/users/refreshtoken')
      .send({
        refreshtoken: refreshToken,
      });
      console.log(refreshToken);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('newToken');
  });
  
  
});