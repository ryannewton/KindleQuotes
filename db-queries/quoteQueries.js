const quoteQueries = client => {
  const bookQueries = require('./bookQueries')(client)
  const userQueries = require('./userQueries')(client)

  // Takes either a bookTitle or bookId, status (optional), and numberOfQuotes (optional)
  const get = async ({ bookTitle, bookId, status, numberOfQuotes, userId, userEmail }) => {
    if (typeof bookId === 'undefined') {
      const user = await userQueries.get({ email: userEmail })
      if (!user) {
        return null
      }
      userId = user.user_id
    }
    let request = 'SELECT * FROM quotes WHERE user_id = $1 AND book_id = $2'
    let values = [userId]
    if (typeof bookId === 'undefined') {
      const book = await bookQueries.getByTitle(bookTitle)
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

  const setToScheduled = async ({ bookId, userId }) => {
    const quotes = await get({ bookId, userId })
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

  return {
    get,
    setToScheduled,

    insert: async (quotes, bookTitle, userEmail) => {
      const { book_id: bookId } = await bookQueries.getByTitle(bookTitle)
      const user = await userQueries.get({ email: userEmail })
      userId = user.user_id
      quotes.forEach(async quote => {
        try {
          const { text, location } = quote
          await client.query(
            'INSERT INTO quotes(book_id, text, location, user_id) VALUES($1, $2, $3, $4)',
            [bookId, text, location, userId]
          )
        } catch (err) {
          console.log('Error: ', err)
        }
      })
    },

    delete: async (quotesText, bookTitle) => {
      const { book_id: bookId } = await bookQueries.getByTitle(bookTitle)
      quotesText.forEach(async quoteText => {
        try {
          await client.query(
            'DELETE FROM quotes WHERE quotes.text = ($1) AND quotes.book_id = ($2)',
            [quoteText, bookId]
          )
        } catch (err) {
          console.log('Error: ', err)
        }
      })
    },

    updateEmailedDate: async quoteIds => {
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
    },
  }
}

module.exports = quoteQueries
