const sendgrid = require('sendgrid')
const keys = require('../config/keys')
const helper = sendgrid.mail

function Mailer() {
  var fromEmail = new helper.Email('newton1988@gmail.com')
  var toEmail = new helper.Email('rnewton@mba2018.hbs.edu')
  var subject = 'Daily Book Quotes'
  var content = new helper.Content('text/plain', 'Test body content')
  var mail = new helper.Mail(fromEmail, subject, toEmail, content)

  var sg = sendgrid(keys.sendGridKey)
  var request = sg.emptyRequest({
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
