const { insertBook, insertQuote, getQuotes } = require('./db-query')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body
    insertBook(title)
    res.send('We received book: '+title)
  })

  app.post('/quotes/add', async (req, res) => {
    const { quote, title } = req.body
    insertQuote(quote, title)
    res.send('We received your quote')
  })

  app.get('/quotes/retrieve', async (req, res) => {
    const { title } = req.body
    const quotes = await getQuotes(title)
    res.send(quotes)
  })
}
