const app = require('../../app');
const request = require('supertest')

describe('user-route', () => {
  let jwt = null
  beforeAll((done) => {
    request(app)
      .post('/user/login')
      .send({ email: 'test@test.com', pass: 'test' })
      .then((res) => {
        // console.log('[[beforeAll /user/login ]]',res.body)
        jwt = res.body.user.jwt; // Or something
        done()
      })
  })
  
  test('/book no-jwt', (done) => {
    return request(app).get('/book')
      .then( (res) => {
        // console.log('[[/book no-jwt]]',res.body)
        expect(res.status).toEqual(403)
        expect(res.body).toEqual({ success: false, message: 'No token provided.' })
        done()
      })
  })
  
  test('/book jwt', (done) => {
    return request(app).get('/book')
      .set('Authorization', `Bearer ${jwt}`)
      .then( (res) => {
        // console.log('[[/book jwt]]', res.body.book.length)
        expect(res.status).toEqual(200)
        expect(res.type).toBe('application/json')
        expect(res.body.book.length).toEqual(100)
        done()
      })
  })
})
