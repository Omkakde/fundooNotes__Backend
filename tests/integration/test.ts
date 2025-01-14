
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
        password: 'password123',
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
  
  let noteId;
  // Create a Note Test
  it('should create a note', async () => {
    const response = await request(app.getApp())
      .post('/api/v1/notes/')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'My First Note',
        description: 'This is my first note.',
      });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('message').that.includes('Note created successfully');
  });
  // Get All Notes Test
  it('should get all notes', async () => {
    const response = await request(app.getApp())
      .get('/api/v1/notes/')
      .set('Authorization', `Bearer ${accessToken}`);
    noteId = response.body.data[0].id
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('Object');
  });
  // Get Note by ID Test
  it('should get note by ID', async () => {
    const response = await request(app.getApp())
      .get(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).to.equal(200);
    expect(response.body[0]).to.have.property('id').that.equals(noteId);
  });
  // Update Note Test
  it('should update a note by ID', async () => {
    const response = await request(app.getApp())
      .put(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'Updated Note',
        description: 'This note has been updated.',
      });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('Note updated');
  });
  // Archive Note Test
  it('should archive a note by ID', async () => {
    const response = await request(app.getApp())
      .put(`/api/v1/notes/${noteId}/archive`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('Note archived');
  });
  // Trash Note Test
  it('should trash a note by ID', async () => {
    const response = await request(app.getApp())
      .put(`/api/v1/notes/${noteId}/trash`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('Note moved to trash');
  });



  // Delete Note Test
  it('should delete a note by ID', async () => {
    const response = await request(app.getApp())
      .delete(`/api/v1/notes/${noteId}`)
      .set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('message').that.includes('Note permanently deleted');
  });
});