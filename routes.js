const schedule = require('node-schedule')
const {
  insertQuote,
  getQuotesAndIds,
  getQuotes,
  updateEmailedDate,
} = require('./db-query')
const { testConnection, insertBook } = require('./db-query-sequelize')
const Mailer = require('./services/Mailer')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body
    const book = await insertBook(title)
    res.send('We received book: ' + book.title)
  })

  app.post('/quotes/add', async (req, res) => {
    const { quotes, title } = req.body
    if(!Array.isArray(quotes) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes and a title')
    }

    quotes.forEach(quote => {
      insertQuote(quote, title)
    })
    res.send('We received your quote(s)')
  })

  app.get('/quotes/retrieve', async (req, res) => {
    const { title } = req.body
    const quotes = await getQuotes(title, 5)
    res.send(quotes)
  })

  app.post('/quotes/schedule', async (req, res) => {
    const { title, time: { minute, hour }} = req.body
    const quotesAndIds = await getQuotesAndIds(title, 5)
    const j = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
      Mailer(quotesAndIds.map(quoteAndId => quoteAndId.quote))
      updateEmailedDate(quotesAndIds.map(quoteAndId => quoteAndId.quote_id))
    });
    res.send('Your emails have been scheduled')
  })

  app.get('/db/test-connection', async (req, res) => {
    testConnection()
  })
}
