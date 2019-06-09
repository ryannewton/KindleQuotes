const { Client } = require('pg')
const { databaseUrl } = require('./config/keys')

const client = new Client({ connectionString: databaseUrl })

client.connect()

const insertBook = async title => {
  try {
    await client.query('INSERT INTO books(title) VALUES($1)', [title])
  } catch(err) {
    console.log('Error: ', err)
  }
}

const deleteBook = async title => {
  try {
    const res = await client.query('DELETE FROM books WHERE books.title = ($1)', [title])
    return res.rowCount
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getBookId = async title => {
  try {
    const res = await client.query('SELECT book_id FROM books WHERE title = ($1)', [title])
    if(res.rows.length === 0) {
      return null
    }
    const { book_id } = res.rows[0]
    return book_id
  } catch(err) {
    console.log('Error: ', err)
  }
}

const insertQuotes = async (quotes, book_title) => {
  const book_id = await getBookId(book_title)
  quotes.forEach(async quote => {
    try {
      await client.query('INSERT INTO quotes(book_id, quote) VALUES($1, $2)', [book_id,quote])
    } catch(err) {
      console.log('Error: ', err)
    }
  })
}

const deleteQuotes = async (quotes, book_title) => {
  const book_id = await getBookId(book_title)
  quotes.forEach(async quote => {
    try {
      await client.query('DELETE FROM quotes WHERE quotes.quote = ($1) AND quotes.book_id = ($2)', [quote, book_id])
    } catch(err) {
      console.log('Error: ', err)
    }
  })
}

const getQuotesAndIds = async (book_title, numberOfQuotes) => {
  const book_id = await getBookId(book_title)
  try {
    const res = await client.query('SELECT quote_id, quote FROM quotes WHERE book_id = $1 ORDER BY last_emailed ASC NULLS FIRST LIMIT $2',[book_id,numberOfQuotes])
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
      await client.query('UPDATE quotes SET last_emailed = NOW() WHERE quote_id = $1',[quote_id])
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

const insertScheduledEmail = async (book_title, time) => {
  const book_id = await getBookId(book_title)
  try {
    const res = await client.query('INSERT INTO scheduled_emails(book_id, time) VALUES($1, $2)',[book_id,time])
    const scheduled_email = res.rows
    return scheduled_email
  } catch(err) {
    console.log('Error: ', err)
  }
}

module.exports = {
  insertBook,
  deleteBook,
  getBookId,
  insertQuotes,
  deleteQuotes,
  getQuotesAndIds,
  getQuotes,
  updateEmailedDate,
  insertScheduledEmail,
}
