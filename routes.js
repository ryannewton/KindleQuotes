const schedule = require('node-schedule')
const { insertBook, insertQuote, getQuotes } = require('./db-query')
const Mailer = require('./services/Mailer')

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

  app.post('/quotes/schedule', async (req, res) => {
    const { title, time: { minute, hour }} = req.body
    const quotes = await getQuotes(title)
    const j = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
      Mailer(quotes)
    });
    res.send('Your emails have been scheduled')
  })
}
