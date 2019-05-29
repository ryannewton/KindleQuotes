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

const insertBook = (title) => {
  client.query('INSERT INTO books(title) VALUES($1)', [title], (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Inserted ', title)
    }
    client.end()
  })
}

const deleteBook = (title) => {
  client.query(`DELETE FROM books WHERE books.title = \'${title}\'`, (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Deleted ', title)
    }
    client.end()
  })
}

const insertQuote = async (quote, book_title) => {
  const res = await client.query(`SELECT book_id FROM books WHERE title = \'${book_title}\'`)
  const bookId = res.rows[0].book_id
  try {
    client.query(`INSERT INTO quotes(book_id, quote) VALUES('${bookId}', '${quote}')`)
  } catch(err) {
    console.log('Error: ', err)
  }
  client.end()
}

module.exports = {
  insertBook,
  deleteBook,
  insertQuote
}
