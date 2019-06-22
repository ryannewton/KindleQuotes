const bookQueries = client => ({
  insert: async ({ title, author }) => {
    try {
      await client.query('INSERT INTO books(title, author) VALUES($1, $2)', [title, author])
    } catch (err) {
      console.log('Error: ', err)
    }
  },

  delete: async title => {
    try {
      const res = await client.query('DELETE FROM books WHERE books.title = ($1)', [title])
      return res.rowCount
    } catch (err) {
      console.log('Error: ', err)
    }
  },

  getByTitle: async title => {
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
  },

  getById: async bookId => {
    try {
      const res = await client.query('SELECT title, author FROM books WHERE book_id = ($1)', [
        bookId,
      ])
      if (res.rows.length === 0) {
        return null
      }
      const { title, author } = res.rows[0]
      // change to just return res.rows[0]
      return { bookTitle: title, author }
    } catch (err) {
      console.log('Error: ', err)
    }
  },
})

module.exports = bookQueries
