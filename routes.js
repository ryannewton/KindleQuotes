const { insertBook, insertQuote } = require('./db-query')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body
    insertBook(title)
    res.send('We received book: '+title)
  });

  app.post('/quotes/add', async (req, res) => {
    const { quote, title } = req.body
    insertQuote(quote, title)
    res.send(bookId)
  })
}
