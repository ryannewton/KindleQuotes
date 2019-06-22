const quoteQueries = client => {
  const bookQueries = require('./bookQueries')(client)

  // Takes either a bookTitle or bookId, status (optional), and numberOfQuotes (optional)
  const get = async ({ bookTitle, bookId, status, numberOfQuotes }) => {
    let request = 'SELECT * FROM quotes WHERE book_id = $1'
    let values = []
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

  const setToScheduled = async bookId => {
    const quotes = await get({ bookId })
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

    insert: async (quotes, bookTitle) => {
      const { book_id: bookId } = await bookQueries.getByTitle(bookTitle)
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
