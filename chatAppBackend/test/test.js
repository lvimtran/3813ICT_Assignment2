const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../server'); 
const expect = chai.expect;
const path = require('path');
const fs = require('fs');



chai.use(chaiHttp);

describe('Chat Routes', () => {
  
  it('POST /api/auth/register should register a new user', async function() {
    const newUser = {
      username: 'testUser' + Date.now(),
      email: 'test' + Date.now() + '@email.com',
      password: 'password123'
    };
        
    const res = await chai.request(server)
      .post('/api/auth/register')
      .send(newUser);
    
    expect(res).to.have.status(201);
    expect(res.body).to.have.property('msg', 'User registered successfully');
  });

  it('POST /api/auth/login should login a user', async function() {
    const userCredentials = {
      username: 'testUser', // Ensure this user is registered before running this test
      password: 'password123'
    };

    const res = await chai.request(server)
      .post('/api/auth/login')
      .send(userCredentials);
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.have.property('msg').eql('Login successful');
  });
    

  it('GET /api/chat/messages should get messages from a channel', async function() {
    const channelId = 'someChannelId'; 
    
    const res = await chai.request(server)
      .get(`/api/chat/messages?channelId=${channelId}`);
    
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
  });
  
  it('POST /api/chat/messages should post a new message', async function() {
    const newMessage = {
      content: 'Test message',
      sender: 'someUserId', 
      channel: 'someChannelId', 
      type: 'text'
    };
    
    try {
      const res = await chai.request(server)
          .post('/api/chat/messages')
          .send(newMessage);
      
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('content').eql(newMessage.content);
    } catch (error) {
      if (error.response) {
        throw new Error(`API Error: ${error.message}\nBody: ${JSON.stringify(error.response.body)}`);
      } else {
        throw error; // Re-throwing the original error if there's no response from server
      }
    }
  });
    
});

describe('Group API Routes', () => {
    it('should get all groups', async () => {
      const res = await chai.request(server).get('/api/groups');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  
    it('should create a new group', async () => {
      const groupData = { name: 'Test Group' };
      const res = await chai.request(server).post('/api/groups').send(groupData);
      expect(res).to.have.status(201);
    });
  
    it('should get all channels of a group', async () => {
      const groupName = 'Test Group';
      const res = await chai.request(server).get(`/api/groups/${groupName}/channels`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
  
    it('should create a new channel in a group', async () => {
      const groupName = 'Test Group';
      const channelData = { name: 'Test Channel' };
      const res = await chai.request(server).post(`/api/groups/${groupName}/channels/create`).send(channelData);
      expect(res).to.have.status(201);
    });
});

describe('Upload Routes', () => {

    it('should upload an image', async function() {
      this.timeout(5000); // Increasing timeout, especially important for file uploads
      
      const imagePath = ('chatAppFrontend/frontend/src/assets/images/profile1.png'); // Put a test image in the test directory
      
      if (!fs.existsSync(imagePath)) {
        throw new Error(`File does not exist: ${imagePath}`);
      }

      const res = await chai.request(server)
        .post('/api/upload')
        .attach('image', fs.readFileSync(imagePath), 'profile1.png');
      
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('imageUrl');
    });
  
    it('should fail to upload if no file provided', async function() {
      const res = await chai.request(server)
        .post('/api/upload');
      
      expect(res).to.have.status(400);
      expect(res.body).to.be.an('object');
      expect(res.body).to.have.property('error', 'No file uploaded.');
    });
  
    it('should fail if file is too large', async function() {
      this.timeout(5000);
      
      const largeImagePath = path.join('chatAppFrontend/frontend/src/assets/images/profile1.png'); // Place a large test image in the test directory
      
      const res = await chai.request(server)
        .post('/api/upload')
        .attach('image', fs.readFileSync(largeImagePath), 'large-test-image.jpg');
      
      expect(res).to.have.status(500); // or whatever your app does in case of an error
      expect(res.body).to.be.an('object');
    });
});

describe('User and Message Routes', () => {

    // Test for user registration
    it('POST /register should register a new user', async function() {
      const newUser = {
        username: 'testUser' + Date.now(),
        password: 'password123'
      };
          
      const res = await chai.request(server)
        .post('/api/user/register')
        .send(newUser);
      
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message', 'User registered successfully!');
    });
  
    it('POST /register should not register user if user exists', async function() {
      const existingUser = {
        username: 'existingUser',
        password: 'password123'
      };
          
      const res = await chai.request(server)
        .post('/api/user/register')
        .send(existingUser);
      
      expect(res).to.have.status(400);
      expect(res.text).to.eql('User exists');
    });
  
    it('POST /register should not register user with insufficient password length', async function() {
      const badUser = {
        username: 'badUser',
        password: 'bad'
      };
          
      const res = await chai.request(server)
        .post('/api/user/register')
        .send(badUser);
      
      expect(res).to.have.status(400);
      expect(res.text).to.eql('Invalid input');
    });
  
    // Test for getting messages of a channel
    it('GET /messages/:channelId should get messages from a channel', async function() {
      const channelId = 'someChannelId'; // Make sure this channel ID exists in your database
      
      const res = await chai.request(server)
        .get(`/api/user/messages/${channelId}`);
      
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
    });
});

