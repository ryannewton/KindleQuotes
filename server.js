const express = require('express')
const bodyParser = require('body-parser')
const initializeServer = require('./initialize-server')
const app = express()

const port = process.env.PORT || 3000
console.log('Server starting...')
initializeServer()
app.use(bodyParser.json())


require('./routes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
