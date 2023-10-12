const chai = require('chai');
const chaiHttp = require('chai-http');
const { server } = require('../server'); 
const expect = chai.expect;

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
        throw new Error(`API Error: ${error.message}\nBody: ${JSON.stringify(error.response.body)}`);
    }
  });  
});

