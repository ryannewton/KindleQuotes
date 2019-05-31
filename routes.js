const schedule = require('node-schedule')
const {
  insertBook,
  insertQuote,
  getQuotesAndIds,
  updateEmailedDate,
} = require('./db-query')
const Mailer = require('./services/Mailer')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body
    insertBook(title)
    res.send('We received book: '+title)
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
    const quotes = await getQuotes(title)
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
}
