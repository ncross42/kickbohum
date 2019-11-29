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
  
  test('/cart/in/1', (done) => {
    return request(app).get('/cart/in/1')
      .then( (res) => {
        // console.log('(no-jwt)[/cart/in/1]',res.body)
        expect(res.status).toEqual(403)
        expect(res.body).toEqual({ success: false, message: 'No token provided.' })
        done()
      })
  })
  
  test('/cart/out/1', (done) => {
    return request(app).get('/cart/out/1')
      .set('Authorization', `Bearer ${jwt}`)
      .then( (res) => {
        // console.log('(jwt)[/cart/out/1]', res.body)
        expect(res.status).toEqual(200)
        expect(res.type).toBe('application/json')
        // expect(res.body.changes).toBeWithinRange(0,1)
        expect(res.body.changes).toBeGreaterThanOrEqual(0)
        done()
      })
  })

  test('/cart/in/1', (done) => {
    return request(app).get('/cart/in/1')
      .set('Authorization', `Bearer ${jwt}`)
      .then( (res) => {
        // console.log('(jwt)[/cart/in/1]', res.body)
        expect(res.status).toEqual(200)
        expect(res.type).toBe('application/json')
        // expect(res.body.changes).toBeWithinRange(1,100)
        expect(res.body.changes).toBeGreaterThanOrEqual(1)
        done()
      })
  })

  test('/cart/my', (done) => {
    return request(app).get('/cart/my')
      .set('Authorization', `Bearer ${jwt}`)
      .then( (res) => {
        // console.log('(jwt)[/cart/my]', res.body)
        expect(res.status).toEqual(200)
        expect(res.type).toBe('application/json')
        expect(res.body.book.length).toEqual(1)
        done()
      })
  })
})
