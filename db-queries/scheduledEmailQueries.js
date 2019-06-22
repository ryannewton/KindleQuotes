const scheduledEmailQueries = client => {
  const bookQueries = require('./bookQueries')(client)
  const userQueries = require('./userQueries')(client)

  return {
    insert: async (bookTitle, time, email) => {
      const { book_id: bookId } = await bookQueries.getByTitle(bookTitle)
      const { user_id: userId } = await userQueries.get({ email })
      const { hour, minute } = time
      const timeStr = hour + ':' + minute + ':00'
      try {
        const res = await client.query(
          'INSERT INTO scheduled_emails(book_id, time, user_id) VALUES($1, $2, $3)',
          [bookId, timeStr, userId]
        )
        const scheduled_email = res.rows
        return scheduled_email
      } catch (err) {
        console.log('Error: ', err)
      }
    },

    get: async () => {
      try {
        const res = await client.query('SELECT * FROM scheduled_emails')
        return res.rows
      } catch (err) {
        console.log('Error: ', err)
      }
    },
  }
}

module.exports = scheduledEmailQueries
