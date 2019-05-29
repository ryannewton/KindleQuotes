const { insertBook } = require('./db-query')

module.exports = app => {
  app.post('/books/add', async (req, res) => {
    const { title } = req.body;
    insertBook(title)
    res.send('We received book: '+title);
  });
}
