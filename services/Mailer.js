const sendgrid = require('sendgrid')
const template = require('./emailTemplate')
const keys = require('../config/keys')
const helper = sendgrid.mail

function Mailer(quotes) {
  const fromEmail = new helper.Email('rnewton@mba2018.hbs.edu')
  const toEmail = new helper.Email('newton1988@gmail.com')
  const subject = 'Daily Book Quotes'
  const content = new helper.Content('text/html', template(quotes))
  const mail = new helper.Mail(fromEmail, subject, toEmail, content)

  const sg = sendgrid(keys.sendGridKey)
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received')
    }
    console.log(response.statusCode)
    console.log(response.body)
    console.log(response.headers)
  })
}

module.exports = Mailer
