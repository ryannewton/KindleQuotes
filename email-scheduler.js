const schedule = require('node-schedule')
const { 
  getScheduledEmails,
  updateEmailedDate,
  getQuotesAndIds,
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
    const quotesAndIds = await getQuotesAndIds({ bookId, numberOfQuotes: 5 })
    const quotes = quotesAndIds.map(quoteAndId => quoteAndId.quote)
    const quoteIds = quotesAndIds.map(quoteAndId => quoteAndId.quote_id)
    const book = await getBookById(bookId)
    const { bookTitle, author } = book
    Mailer({ quotes, bookTitle, author })
    updateEmailedDate(quoteIds)
  })
}

module.exports = {
  scheduleAllEmails,
  scheduleEmail,
}
