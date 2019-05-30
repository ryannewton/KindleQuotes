const express = require('express')
const bodyParser = require('body-parser');
const app = express()

const port = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Hello World!'))
require('./routes')(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
