const sqlite = require('sqlite')

module.exports = async () => {
  const [dbShop] = await Promise.all([
    sqlite.open('./kick.sqlite', { cached: true })
    // sqlite.open('./test.sqlite', { Promise }),
  ])
  await Promise.all([
    dbShop.migrate({migrationsPath: './migrations/kick'}),
    // dbTest.migrate({migrationsPath: './migrations/test'})
  ])
  // return {dbShop, dbTest}
  return dbShop
}
