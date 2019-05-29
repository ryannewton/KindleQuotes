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

client.query('INSERT INTO books(title) VALUES($1)', ['Never Split the Difference'], (err, res) => {
  if(err) {
    console.log('ERROR: ', err)
  } else {
    console.log('INSERT successful')
  }
  client.end()
})

// client.query('DELETE FROM books WHERE books.book_id = \'ee8edae8-3aa9-4dde-acf2-40f6d4b07ed1\'', (err, res) => {
//   if(err) {
//     console.log('ERROR: ', err)
//   } else {
//     console.log('DELETE successful')
//   }
//   client.end()
// })
