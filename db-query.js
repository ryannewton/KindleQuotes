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

const getBookId = async title => {
  const res = await client.query(`SELECT book_id FROM books WHERE title = \'${title}\'`)
  const { book_id } = res.rows[0]
  return book_id
}

const insertQuote = async (quote, book_title) => {
  const book_id = await getBookId(book_title)
  try {
    await client.query(`INSERT INTO quotes(book_id, quote) VALUES('${book_id}', '${quote}')`)
  } catch(err) {
    console.log('Error: ', err)
  }
}

const insertQuotes = async (quotes, book_title) => {
  const book_id = await getBookId(book_title)
  quotes.forEach(async quote => {
    try {
      await client.query(`INSERT INTO quotes(book_id, quote) VALUES('${book_id}', '${quote}')`)
    } catch(err) {
      console.log('Error: ', err)
    }
  })
}

const getQuotesAndIds = async (book_title, numberOfQuotes) => {
  const book_id = await getBookId(book_title)
  try {
    const res = await client.query(`SELECT quote_id, quote FROM quotes WHERE book_id = '${book_id}' ORDER BY last_emailed ASC NULLS FIRST LIMIT ${numberOfQuotes}`)
    const quotes = res.rows
    return quotes
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getQuotes = async (book_title, numberOfQuotes) => {
  const quotesAndIds = await getQuotesAndIds(book_title, numberOfQuotes)
  const quotes = quotesAndIds.map(quoteAndId => quoteAndId.quote)
  return quotes
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
  insertQuotes,
  getQuotesAndIds,
  getQuotes,
  updateEmailedDate,
}
