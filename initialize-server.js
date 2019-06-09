const { scheduleAllEmails } = require('./email-scheduler')

const initializeServer = () => {
  // Move DB connection from server.js to here

  console.log('Initializing server...')
  scheduleAllEmails()
  console.log('Server initialized')
}

module.exports = initializeServer
