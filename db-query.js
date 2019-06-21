const { Client } = require('pg')
const { databaseUrl } = require('./config/keys')

const client = new Client({ connectionString: databaseUrl })

client.connect()

const insertBook = async ({ title, author }) => {
  try {
    await client.query('INSERT INTO books(title, author) VALUES($1, $2)', [title, author])
  } catch (err) {
    console.log('Error: ', err)
  }
}

const deleteBook = async title => {
  try {
    const res = await client.query('DELETE FROM books WHERE books.title = ($1)', [title])
    return res.rowCount
  } catch (err) {
    console.log('Error: ', err)
  }
}

const getBookByTitle = async title => {
  try {
    const res = await client.query('SELECT * FROM books WHERE title = ($1)', [title])
    if (res.rows.length === 0) {
      return null
    }
    const book = res.rows[0]
    return book
  } catch (err) {
    console.log('Error: ', err)
  }
}

const getBookById = async bookId => {
  try {
    const res = await client.query('SELECT title, author FROM books WHERE book_id = ($1)', [bookId])
    if (res.rows.length === 0) {
      return null
    }
    const { title, author } = res.rows[0]
    // change to just return res.rows[0]
    return { bookTitle: title, author }
  } catch (err) {
    console.log('Error: ', err)
  }
}

const insertQuotes = async (quotes, bookTitle) => {
  const { book_id: bookId } = await getBookByTitle(bookTitle)
  quotes.forEach(async quote => {
    try {
      const { text, location } = quote
      await client.query('INSERT INTO quotes(book_id, text, location) VALUES($1, $2, $3)', [
        bookId,
        text,
        location,
      ])
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

const deleteQuotes = async (quotesText, bookTitle) => {
  const { book_id: bookId } = await getBookByTitle(bookTitle)
  quotesText.forEach(async quoteText => {
    try {
      await client.query('DELETE FROM quotes WHERE quotes.text = ($1) AND quotes.book_id = ($2)', [
        quoteText,
        bookId,
      ])
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

// Takes either a bookTitle or bookId, status (optional), and numberOfQuotes (optional)
const getQuotes = async ({ bookTitle, bookId, status, numberOfQuotes }) => {
  let request = 'SELECT * FROM quotes WHERE book_id = $1'
  let values = []
  if (typeof bookId === 'undefined') {
    const book = await getBookByTitle(bookTitle)
    if (!book) {
      return null
    }
    bookId = book.book_id
  }
  values.push(bookId)

  if (typeof status !== 'undefined') {
    values.push(status)
    request += ' AND status = $' + values.length
  }
  request += ' ORDER BY location ASC NULLS FIRST'

  if (typeof numberOfQuotes !== 'undefined') {
    values.push(numberOfQuotes)
    request += ' LIMIT $' + values.length
  }
  try {
    const res = await client.query(request, values)
    const quotes = res.rows
    return quotes
  } catch (err) {
    console.log('Error: ', err)
  }
}

const updateEmailedDate = async quoteIds => {
  quoteIds.forEach(async quoteId => {
    try {
      await client.query(
        'UPDATE quotes SET last_emailed = NOW(), status = $1 WHERE quote_id = $2',
        ['SENT', quoteId]
      )
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

const setQuotesToScheduled = async bookId => {
  const quotes = await getQuotes({ bookId })
  quotes.forEach(async quote => {
    try {
      await client.query('UPDATE quotes SET status = $1 WHERE quote_id = $2', [
        'SCHEDULED',
        quote.quote_id,
      ])
    } catch (err) {
      console.log('Error: ', err)
    }
  })
}

const insertScheduledEmail = async (bookTitle, time) => {
  const { book_id: bookId } = await getBookByTitle(bookTitle)
  const { hour, minute } = time
  const timeStr = hour + ':' + minute + ':00'
  try {
    const res = await client.query('INSERT INTO scheduled_emails(book_id, time) VALUES($1, $2)', [
      bookId,
      timeStr,
    ])
    const scheduled_email = res.rows
    return scheduled_email
  } catch (err) {
    console.log('Error: ', err)
  }
}

const getScheduledEmails = async () => {
  try {
    const res = await client.query('SELECT * FROM scheduled_emails')
    return res.rows
  } catch (err) {
    console.log('Error: ', err)
  }
}

const insertUser = async email => {
  try {
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email])
    if (res.rows.length === 0) {
      await client.query('INSERT INTO users(email) VALUES($1)', [email])
    }
  } catch (err) {
    console.log('Error: ', err)
  }
}

const getUser = async userId => {
  try {
    const res = await client.query('SELECT * FROM users WHERE user_id = $1', [userId])
    return res.rows[0]
  } catch (err) {
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
  getQuotes,
  updateEmailedDate,
  setQuotesToScheduled,
  insertScheduledEmail,
  getScheduledEmails,
  insertUser,
  getUser,
}
