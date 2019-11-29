const app = require('../../app');
const request = require('supertest')

let jwt = null
describe('user-route', () => {
  beforeAll((done) => {
    request(app)
      .post('/user/login')
      .send({ email: 'test@test.com', pass: 'test' })
      .then((res) => {
        // console.log('[[beforeAll /user/login ]]',res.body)
        jwt = res.body.user.jwt // Or something
        done()
      })
  })
  
  test('/user/me no-jwt', (done) => {
    return request(app).get('/user/me')
      .then( (res) => {
        // console.log('[[/user/me no-jwt]]',res.body)
        expect(res.status).toEqual(403)
        expect(res.body).toEqual({ success: false, message: 'No token provided.' })
        done()
      })
  })
  
  test('/user/me jwt', (done) => {
    return request(app).get('/user/me')
      .set('Authorization', `Bearer ${jwt}`)
      .then( (res) => {
        // console.log('[[/user/me jwt]]',res.body)
        expect(res.status).toEqual(200)
        expect(res.type).toBe('application/json')
        done()
      })
  })
})
