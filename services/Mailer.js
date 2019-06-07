const sgMail = require('@sendgrid/mail')
const keys = require('../config/keys')

sgMail.setApiKey(keys.sendGridKey)

const toEmail = 'Ryan Newton <newton1988@gmail.com>'
const fromEmail = 'Ryan Newton <rnewton@mba2018.hbs.edu>'
const subject = 'Daily Book Quotes'

const Mailer = (quotes, title) => {
  const msg = {
    to: toEmail,
    from: fromEmail,
    subject,
    templateId: keys.sendGridTemplateId,
    dynamic_template_data: {
      quote0: quotes[0],
      quote1: quotes[1],
      quote2: quotes[2],
      quote3: quotes[3],
      quote4: quotes[4],
      title,
    },
  }

  sgMail.send(msg)
}

module.exports = Mailer
