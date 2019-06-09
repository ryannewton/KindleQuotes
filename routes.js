const schedule = require('node-schedule')
const {
  getQuotesAndIds,
  getQuotes,
  updateEmailedDate,
  testConnection,
  insertBook,
  insertQuotes,
  deleteQuotes,
  insertScheduledEmail,
} = require('./db-query')
const Mailer = require('./services/Mailer')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body
    await insertBook(title)
    res.send('We received book: ' + title)
  })

  app.post('/quotes/add', async (req, res) => {
    const { quotes, title } = req.body
    if(!Array.isArray(quotes) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes and a title')
    }

    insertQuotes(quotes, title)
    res.send('We received your quote(s)')
  })

  app.delete('/quotes/delete', async (req, res) => {
    const { quotes, title } = req.body
    if(!Array.isArray(quotes) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes and a title')
    }

    deleteQuotes(quotes, title)
    res.send('We deleted your quote(s)')
  })

  app.get('/quotes/retrieve', async (req, res) => {
    const { title } = req.body
    const quotes = await getQuotes(title, 5)
    res.send(quotes)
  })

  app.post('/quotes/schedule', async (req, res) => {
    const { title, time: { minute, hour }} = req.body
    const time = hour+':'+minute+':00'
    const quotesAndIds = await getQuotesAndIds({ bookTitle: title, numberOfQuotes: 5 })
    const quotes = quotesAndIds.map(quoteAndId => quoteAndId.quote)
    const quoteIds = quotesAndIds.map(quoteAndId => quoteAndId.quote_id)
    insertScheduledEmail(title, time)
    const j = schedule.scheduleJob(`${minute} ${hour} * * *`, () => {
      Mailer(quotes, title)
      updateEmailedDate(quoteIds)
    })
    res.send('Your emails have been scheduled')
  })

  app.get('/db/test-connection', async (req, res) => {
    await testConnection()
  })
}
