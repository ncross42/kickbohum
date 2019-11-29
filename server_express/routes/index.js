var express = require('express');
var router = express.Router();
const dbKick = require('../db.sqlite')

router.use('/user', require('./user'));
router.use('/insure', require('./insure'));
router.use('/track', require('./track'));

/* GET home page. */
router.get('/', async (req, res, next) => {
  console.log(process.env.SALT)
  try {
    const db = await dbKick()
    const rows = await db.get('SELECT Datetime("now","localtime") AS now');
    // console.log(rows);
    res.render('index', {
      title: 'SHOP API v1',
      ts: rows.now
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
