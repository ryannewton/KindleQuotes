const { Client } = require('pg')
const { databaseUrl } = require('../config/keys')

const client = new Client({ connectionString: databaseUrl })

client.connect()
const bookQueries = require('./bookQueries')(client)
const scheduledEmailQueries = require('./scheduledEmailQueries')(client)
const userQueries = require('./userQueries')(client)
const quoteQueries = require('./quoteQueries')(client)

module.exports = {
  bookQueries,
  scheduledEmailQueries,
  userQueries,
  quoteQueries,
}
