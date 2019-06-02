const Sequelize = require('sequelize')
const QuoteModel = require('./quote')
const BookModel = require('./book')
const { databaseUrl } = require('../config/keys')

const sequelize = new Sequelize(databaseUrl)

const Book = BookModel(sequelize, Sequelize)
const Quote = QuoteModel(sequelize, Sequelize)

const db = {
  Book,
  Quote,
}

Quote.belongsTo(Book, { foreignKey: 'book_id' });

sequelize.sync()
  .then(() => {
    console.log('Database & tables created!')
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
