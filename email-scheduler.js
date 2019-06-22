const schedule = require('node-schedule')
const { scheduledEmailQueries, quoteQueries, bookQueries } = require('./db-queries')
const Mailer = require('./services/Mailer')

const scheduleAllEmails = async () => {
  const scheduledEmails = await scheduledEmailQueries.get()
  scheduledEmails.forEach(scheduledEmail => {
    const bookId = scheduledEmail.book_id
    const hour = parseInt(scheduledEmail.time.substring(0, 2))
    const minute = parseInt(scheduledEmail.time.substring(3, 5))
    const time = { minute, hour }
    const userId = scheduledEmail.user_id
    scheduleEmail({ time, bookId, userId })
  })
}

const scheduleEmail = async ({ time, bookId, userId }) => {
  const { minute, hour } = time
  schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
    const quotes = await quoteQueries.get({
      bookId,
      status: 'SCHEDULED',
      numberOfQuotes: 5,
      userId,
    })
    const quotesText = quotes.map(quote => quote.text)
    const quoteIds = quotes.map(quote => quote.quote_id)
    const book = await bookQueries.getById(bookId)
    const { bookTitle, author } = book
    Mailer({ quotesText, bookTitle, author, userId })
    quoteQueries.updateEmailedDate(quoteIds)
  })
}

module.exports = {
  scheduleAllEmails,
  scheduleEmail,
}
