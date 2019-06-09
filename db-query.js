const { Client } = require('pg')
const { databaseUrl } = require('./config/keys')

const client = new Client({ connectionString: databaseUrl })

client.connect()

const insertBook = async ({ title, author }) => {
  try {
    await client.query('INSERT INTO books(title, author) VALUES($1, $2)', [title, author])
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

const getBookByTitle = async title => {
  try {
    const res = await client.query('SELECT * FROM books WHERE title = ($1)', [title])
    if(res.rows.length === 0) {
      return null
    }
    const book = res.rows[0]
    return book
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getBookById = async bookId => {
  try {
    const res = await client.query('SELECT title, author FROM books WHERE book_id = ($1)', [bookId])
    if(res.rows.length === 0) {
      return null
    }
    const { title, author } = res.rows[0]
    return { bookTitle: title, author }
  } catch(err) {
    console.log('Error: ', err)
  }
}

const insertQuotes = async (quotes, bookTitle) => {
  const { book_id: bookId } = await getBookByTitle(bookTitle)
  quotes.forEach(async quote => {
    try {
      await client.query('INSERT INTO quotes(book_id, quote) VALUES($1, $2)', [bookId,quote])
    } catch(err) {
      console.log('Error: ', err)
    }
  })
}

const deleteQuotes = async (quotes, book_title) => {
  const { book_id: bookId } = await getBookByTitle(book_title)
  quotes.forEach(async quote => {
    try {
      await client.query('DELETE FROM quotes WHERE quotes.quote = ($1) AND quotes.book_id = ($2)', [quote, bookId])
    } catch(err) {
      console.log('Error: ', err)
    }
  })
}

// Takes numberOfQuotes and either a bookTitle or bookId
const getQuotesAndIds = async ({ bookTitle, bookId, numberOfQuotes }) => {
  if (!bookId) {
    const book = await getBookByTitle(bookTitle)
    bookId = book.book_id
  }
  try {
    const res = await client.query('SELECT quote_id, quote FROM quotes WHERE book_id = $1 ORDER BY last_emailed ASC NULLS FIRST LIMIT $2',[bookId,numberOfQuotes])
    const quotes = res.rows
    return quotes
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getQuotes = async (bookTitle, numberOfQuotes) => {
  const quotesAndIds = await getQuotesAndIds({ bookTitle, numberOfQuotes })
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

const insertScheduledEmail = async (bookTitle, time) => {
  const { book_id: bookId } = await getBookByTitle(bookTitle)
  const { hour, minute } = time
  const timeStr = hour+':'+minute+':00'
  try {
    const res = await client.query('INSERT INTO scheduled_emails(book_id, time) VALUES($1, $2)',[bookId,timeStr])
    const scheduled_email = res.rows
    return scheduled_email
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getScheduledEmails = async () => {
  try {
    const res = await client.query('SELECT * FROM scheduled_emails')
    return res.rows
  } catch(err) {
    console.log('Error: ', err)
  }
}

module.exports = {
  insertBook,
  deleteBook,
  getBookByTitle,
  getBookById,
  insertQuotes,
  deleteQuotes,
  getQuotesAndIds,
  getQuotes,
  updateEmailedDate,
  insertScheduledEmail,
  getScheduledEmails,
}
