const { Client } = require('pg')
const { databaseUrl } = require('./config/keys')

const client = new Client({ connectionString: databaseUrl })

client.connect()

const insertBook = (title) => {
  client.query('INSERT INTO books(title) VALUES($1)', [title], (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Inserted ', title)
    }
  })
}

const deleteBook = (title) => {
  client.query(`DELETE FROM books WHERE books.title = \'${title}\'`, (err, res) => {
    if(err) {
      console.log('ERROR: ', err)
    } else {
      console.log('Deleted ', title)
    }
  })
}

const insertQuote = async (quote, book_title) => {
  const res = await client.query(`SELECT book_id FROM books WHERE title = \'${book_title}\'`)
  const bookId = res.rows[0].book_id
  try {
    await client.query(`INSERT INTO quotes(book_id, quote) VALUES('${bookId}', '${quote}')`)
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getQuotesAndIds = async (book_title, numberOfQuotes) => {
  const res = await client.query(`SELECT book_id FROM books WHERE title = \'${book_title}\'`)
  const bookId = res.rows[0].book_id
  try {
    const res = await client.query(`SELECT quote_id, quote FROM quotes WHERE book_id = '${bookId}'`)
    const quotes = res.rows.slice(0, numberOfQuotes)
    return quotes
  } catch(err) {
    console.log('Error: ', err)
  }
}

const updateEmailedDate = async (quote_ids) => {
  quote_ids.forEach(async quote_id => {
    try {
      const res = await client.query(`UPDATE quotes SET last_emailed = NOW() WHERE quote_id = '${quote_id}'`)
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

module.exports = {
  insertBook,
  deleteBook,
  insertQuote,
  getQuotesAndIds,
  updateEmailedDate,
}
