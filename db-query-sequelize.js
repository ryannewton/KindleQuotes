const { sequelize, Book, Quote, Sequelize } = require('./models')

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

const insertQuotes = async (quotes, book_title) => {
  const book_id = await getBookId(book_title)
  const new_records = quotes.map(quote => ({ quote, book_id }))
  try {
    await Quote.bulkCreate(new_records)
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getQuotesAndIds = async (book_title, numberOfQuotes) => {
  const book_id = await getBookId(book_title)

  try {
    const res = await Quote.findAll({
      attributes: ['quote', 'quote_id'],
      where: { book_id },
      order: [
        ['last_emailed', 'ASC NULLS FIRST']
      ],
      limit: numberOfQuotes,
    })
    const quotesAndIds = res.map(row => {
      const { quote, quote_id } = row.dataValues
      return { quote, quote_id }
    })

    console.log('quotes: ', quotesAndIds)
    return quotesAndIds
  } catch(err) {
    console.log('Error: ', err)
  }
}

const getQuotes = async (book_title, numberOfQuotes) => {
  const quotesAndIds = await getQuotesAndIds(book_title, numberOfQuotes)
  const quotes = quotesAndIds.map(quoteAndId => quoteAndId.quote)
  return quotes
}

module.exports = {
  testConnection,
  insertBook,
  insertQuotes,
  getQuotesAndIds,
  getQuotes,
}
