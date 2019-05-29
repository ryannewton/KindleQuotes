const { Client } = require('pg')
const {
  postgresUser,
  postgresHost,
  postgresDatabase,
  postgresPassword,
  postgresPort
} = require('./config/keys')

const client = new Client({
  user: postgresUser,
  host: postgresHost,
  database: postgresDatabase,
  password: postgresPassword,
  port: postgresPort,
})

client.connect()

console.log('connected')

function insertBook(title) {
  client.query('INSERT INTO books(title) VALUES($1)', [title], (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Inserted ', title)
    }
    client.end()
  })
}

function deleteBook(title) {
  client.query(`DELETE FROM books WHERE books.title = \'${title}\'`, (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Deleted ', title)
    }
    client.end()
  })
}


module.exports = {
  insertBook,
  deleteBook
}
