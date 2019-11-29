var express = require('express');
var router = express.Router();
const SQL = require('sql-template-strings')
const dbKick = require('../db.sqlite')

/* GET users listing. */
router.get('/list/:user_id', async (req, res, next) => {
  if ( !req.params.user_id /* === undefined */) {
    return res.status(500).json({message:'no user_id'})
  }

  try {
    const db = await dbKick()
    const rows = await db.get(`SELECT * FROM track WHERE user_id = ${req.params.user_id}`);
    res.json(rows)
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
});

/* GET users listing. */
router.get('/open/:user_id/:ts?', async (req, res, next) => {
  if ( !req.params.user_id /* === undefined */) {
    return res.status(500).json({message:'no user_id'})
  }

  const ts = (!req.params.ts) ? "datetime('now', 'localtime')" : `datetime(${req.params.ts}, 'unixepoch')`
  try {
    const db = await dbKick()
    const ret = await db.run(`INSERT INTO track (user_id, ts) VALUES ( ${req.params.user_id}, ${ts} )`);
    res.json({track_id:ret.stmt.lastID})
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
});

/* GET users listing. */
router.get('/gps/:track_id/:lat/:lng/:ts?', async (req, res, next) => {
  if ( !req.params.track_id /* === undefined */) {
    return res.status(500).json({message:'no track_id'})
  }

  const lat = parseFloat(req.params.lat)
  const lng = parseFloat(req.params.lng)
  const ts = (!req.params.ts) ? "datetime('now', 'localtime')" : `datetime(${req.params.ts}, 'unixepoch')`
  try {
    const db = await dbKick()
    const sql = `INSERT INTO gps (track_id, ts, lat, lng) VALUES ( ${req.params.track_id}, ${ts}, ${lat}, ${lng} )`
    // console.log(sql)
    const ret = await db.run(sql);
    res.status(200).send('ok')
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
});

function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {
  function deg2rad(deg) {
      return deg * (Math.PI/180)
  }

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lng2-lng1);
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d*1000;
}

/* GET users listing. */
router.get('/close/:track_id/:lat/:lng/:ts?', async (req, res, next) => {
  if ( !req.params.track_id /* === undefined */) {
    return res.status(500).json({message:'no track_id'})
  }

  const track_id = parseInt(req.params.track_id)
  const lat = parseFloat(req.params.lat)
  const lng = parseFloat(req.params.lng)
  const ts = (!req.params.ts) ? "datetime('now', 'localtime')" : `datetime(${req.params.ts}, 'unixepoch')`
  try {
    const db = await dbKick()
    let sql = `INSERT INTO gps (track_id, ts, lat, lng) VALUES ( ${track_id}, ${ts}, ${lat}, ${lng} )`
    let ret = await db.run(sql);
    console.log(sql)
    
    getDistanceMeter = async () => {
      let total_meter = 0
      const rows = await db.all(SQL`SELECT lat, lng FROM gps WHERE track_id = ${track_id}`)
      console.log(' ### rows ###', rows.length)
      if (rows.length) {
        let before = false
        rows.forEach((row) => {
          if (before !== false) {
            total_meter += getDistanceFromLatLonInKm(before.lat, before.lng, row.lat, row.lng)
          }
          before = row
        })
      }
      console.log(total_meter)
      return total_meter
    }
    const distance = await getDistanceMeter()
    sql = SQL`UPDATE track SET distance = ${distance} WHERE id = ${track_id}`
    ret = await db.run(sql);
    res.json({track_id, distance})
  } catch (error) {
    const ret = { code:error.code, errno: error.errno, message: error.message }
    console.log(ret)
    res.status(500).json(ret)
  }
});

module.exports = router;
