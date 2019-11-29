const app = require('../app');
const request = require('supertest')

describe('AppService', () => {
  test('favicon.ico', async (done) => {
    const response = await request(app).get('/favicon.ico')
    expect(response.status).toEqual(204)
    done()
  });
})

