const request = require('supertest');
const app = require('./main');  // Import the app

describe('/', () => {
  it('should render the main page', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Hello world');  // Adjust this to match the expected text in your login page
  });
});