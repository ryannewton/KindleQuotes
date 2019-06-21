const sgMail = require('@sendgrid/mail')
const keys = require('../config/keys')
const { getUser } = require('../db-query')

sgMail.setApiKey(keys.sendgridKey)

const fromEmail = 'Ryan Newton <rnewton@mba2018.hbs.edu>'
const subject = 'Daily Book Quotes'

const Mailer = async ({ quotesText, bookTitle, author, userId }) => {
  const { email: toEmail } = await getUser({ userId })
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject,
    templateId: keys.sendgridTemplateId,
    dynamic_template_data: {
      quote0: quotesText[0],
      quote1: quotesText[1],
      quote2: quotesText[2],
      quote3: quotesText[3],
      quote4: quotesText[4],
      bookTitle,
      author,
    },
  }

  sgMail.send(msg)
}

module.exports = Mailer
