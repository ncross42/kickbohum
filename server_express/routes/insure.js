var express = require('express')
var router = express.Router()
const SQL = require('sql-template-strings')
const dbKick = require('../db.sqlite')

/* GET insurance listing. */
router.get('/list', async (req, res, next) => {
  try {
    const db = await dbKick()
    const rows = await db.all(SQL`SELECT * FROM insure`)
    // console.log(rows.length)
    res.json(rows)
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
})

/* contract . */
router.get('/contract/:user_id/:insure_id/:ts?', async (req, res, next) => {
  // console.log(req.params)
  if ( !req.params.user_id /* === undefined */) {
    return res.status(500).json({message:'no user_id'})
  }
  const user_id = parseInt(req.params.user_id)
  try {
    const db = await dbKick()
    let track_id = 0
    // check exist contract
    const row = await db.get(`SELECT id FROM track WHERE user_id = ${user_id} AND insure_id <> 0 LIMIT 1`);
    if (!row) {
      const ts = (!req.params.ts) ? "datetime('now', 'localtime')" : `datetime(${req.params.ts}, 'unixepoch')`
      sql = `INSERT INTO track (user_id, ts, insure_id) VALUES ( ${user_id}, ${ts}, ${req.params.insure_id} )`
      // console.log(sql)
      const ret = await db.run(sql)
      track_id = ret.stmt.lastID
    } else {
      track_id = row.id
    }
    res.json({track_id})
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
})

module.exports = router;
