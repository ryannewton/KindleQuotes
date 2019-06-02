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

module.exports = {
  testConnection,
  insertBook,
}
