const sgMail = require('@sendgrid/mail')
const keys = require('../config/keys')

sgMail.setApiKey(keys.sendGridKey)

const toEmail = 'Ryan Newton <newton1988@gmail.com>'
const fromEmail = 'Ryan Newton <rnewton@mba2018.hbs.edu>'
const subject = 'Daily Book Quotes'

const Mailer = ({ quotesText, bookTitle, author }) => {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject,
    templateId: keys.sendGridTemplateId,
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
