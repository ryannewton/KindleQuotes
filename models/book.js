const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('book', {
    book_id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: uuid(),
      allowNull: false,
    },
    title: DataTypes.TEXT,
  }, {
    timestamps: false,
  })
}
