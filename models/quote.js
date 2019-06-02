const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  const Quote = sequelize.define('quote', {
    quote_id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: uuid,
      allowNull: false,
    },
    quote: DataTypes.TEXT,
    last_emailed: DataTypes.DATE,
  }, {
    timestamps: false,
    underscore: true,
  })

  Quote.associate = (models) => {
    models.Quote.belongsTo(models.Book, {
      foreignKey: {
        name: 'book_id',
        allowNull: false,
      }
    })
  }

  return Quote
};
