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
  getBookByTitle,
} = require('./db-query')
const { scheduleEmail } = require('./email-scheduler')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title, author } = req.body
    await insertBook({ title, author })
    res.send('We received book: ' + title)
  })

  app.post('/quotes/add', async (req, res) => {
    const { quotesWithLocations, title } = req.body
    if(!Array.isArray(quotesWithLocations) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes (with locations) and a title')
    }

    insertQuotes(quotesWithLocations, title)
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
    const { bookTitle, time } = req.body
    const { book_id } = await getBookByTitle(bookTitle)
    insertScheduledEmail(bookTitle, time)
    scheduleEmail({ time, bookId: book_id })
    res.send('Your emails have been scheduled')
  })

  app.get('/db/test-connection', async (req, res) => {
    await testConnection()
  })
}
