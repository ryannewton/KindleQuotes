const schedule = require('node-schedule')
const { 
  getScheduledEmails,
  updateEmailedDate,
  getQuotes,
  getBookById,
} = require('./db-query')
const Mailer = require('./services/Mailer')


const scheduleAllEmails = async () => {
  const scheduledEmails = await getScheduledEmails()
  scheduledEmails.forEach(scheduledEmail => {
    const bookId = scheduledEmail.book_id
    const hour = parseInt(scheduledEmail.time.substring(0,2))
    const minute = parseInt(scheduledEmail.time.substring(3,5))
    const time = { minute, hour }
    scheduleEmail({ time, bookId })
  })
}

const scheduleEmail = async ({ time, bookId }) => {
  const { minute, hour } = time
  schedule.scheduleJob(`${minute} ${hour} * * *`, async () => {
    const quotes = await getQuotes({ bookId, status: 'SCHEDULED', numberOfQuotes: 5 })
    const quotesText = quotes.map(quote => quote.text)
    const quoteIds = quotes.map(quote => quote.quote_id)
    const book = await getBookById(bookId)
    const { bookTitle, author } = book
    Mailer({ quotesText, bookTitle, author })
    updateEmailedDate(quoteIds)
  })
}

module.exports = {
  scheduleAllEmails,
  scheduleEmail,
}
