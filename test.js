const request = require('supertest');
const app = require('./main');  // Import the app

describe('GET /login', () => {
  it('should render the login page', async () => {
    const response = await request(app).get('/login');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('login');  // Adjust this to match the expected text in your login page
  });
});