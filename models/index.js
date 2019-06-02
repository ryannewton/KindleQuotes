const Sequelize = require('sequelize')
const QuoteModel = require('./quote')
const BookModel = require('./book')
const { databaseUrl } = require('../config/keys')

const sequelize = new Sequelize(databaseUrl)

const Book = BookModel(sequelize, Sequelize)
const Quote = QuoteModel(sequelize, Sequelize)

Quote.belongsTo(Book, { as: 'book_id' });

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!')
  })

module.exports = {
  sequelize,
  Quote,
  Book,
}
