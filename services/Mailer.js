const sendgrid = require('sendgrid')
const helper = sendgrid.mail

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super()
  }
}

module.exports = Mailer
