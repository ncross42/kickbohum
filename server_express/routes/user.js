var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings')
const dbKick = require('../db.sqlite')

const SECRET = process.env.SALT;

/* GET users listing. */
router.post('/login', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  if (!req.body.hasOwnProperty('email')) {
    return res.status(400).json({message: 'Bad request: check params {email}'})
  }
  // console.log(req.body)

  const {email} = req.body
  // const db = req.app.locals.dbKick
  try {
    const db = await dbKick()
    let user = await db.get(SQL`SELECT id, role, email FROM user WHERE email = ${email}`)
    if ( !user ) {
      // console.log(1, user);
      let ret = await db.run(SQL`INSERT INTO user (email) VALUES ( ${email} )`)
      user = { id: ret.stmt.lastID, role: 'customer', email }
    }
    // console.log(user)
    res.json(user)
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
});

/* GET users listing. */
router.get('/me', async (req, res, next) => {
  try {
    // const db = req.app.locals.dbKick
    const db = await dbKick()
    const user = await db.get(SQL`SELECT id, role, email FROM user WHERE email = ${req.user.email}`);
    // console.log(user);
    res.json({user});
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    res.status(500).json(ret)
  }
});

module.exports = router;
