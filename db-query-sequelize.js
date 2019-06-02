const { sequelize, Book, Quote } = require('./models')

const testConnection = () => {
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}

const insertBook = async title => {
  const res = await Book.create({ title })
  return res.dataValues
}

const getBookId = async title => {
  const { dataValues } = await Book.findOne({ where: { title: title }})
  const { book_id } = dataValues
  return book_id
}

const insertQuote = async (quote, book_title) => {
  const book_id = await getBookId(book_title)
  try {
    await Quote.create({ quote, book_id })
  } catch(err) {
    console.log('Error: ', err)
  }
}

const insertQuotes = async (quotes, book_title) => {
  const book_id = await getBookId(book_title)
  const new_records = quotes.map(quote => ({ quote, book_id }))
  try {
    await Quote.bulkCreate(new_records)
  } catch(err) {
    console.log('Error: ', err)
  }
}

module.exports = {
  testConnection,
  insertBook,
  insertQuote,
  insertQuotes,
}
