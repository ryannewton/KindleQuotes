const schedule = require('node-schedule')
const { bookQueries, scheduledEmailQueries, userQueries, quoteQueries } = require('./db-queries')
const { scheduleEmail } = require('./email-scheduler')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title, author } = req.body
    await bookQueries.insert({ title, author })
    res.send('We received book: ' + title)
  })

  app.post('/quotes/add', async (req, res) => {
    const { quotesWithLocations, title } = req.body
    if (!Array.isArray(quotesWithLocations) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes (with locations) and a title')
    }

    quoteQueries.insert(quotesWithLocations, title)
    res.send('We received your quote(s)')
  })

  app.delete('/quotes/delete', async (req, res) => {
    const { quotes, title } = req.body
    if (!Array.isArray(quotes) || !(typeof title == 'string')) {
      return res.status(400).send('Please include an array of quotes and a title')
    }

    quoteQueries.delete(quotes, title)
    res.send('We deleted your quote(s)')
  })

  app.get('/quotes/retrieve', async (req, res) => {
    const { title } = req.body
    const quotes = await quoteQueries.get({ bookTitle: title })
    res.send(quotes)
  })

  app.post('/quotes/schedule', async (req, res) => {
    const { bookTitle, time, email } = req.body
    const { book_id: bookId } = await bookQueries.getByTitle(bookTitle)
    const { user_id: userId } = await userQueries.get({ email })
    scheduledEmailQueries.insert(bookTitle, time, email)
    scheduleEmail({ time, bookId, userId })
    quoteQueries.setToScheduled(bookId)
    res.send('Your emails have been scheduled')
  })

  app.post('/users/add', async (req, res) => {
    const { email } = req.body
    userQueries.insert(email)
    res.send('New user created')
  })
}
