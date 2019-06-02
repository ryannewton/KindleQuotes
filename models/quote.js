const uuid = require('uuid/v4')

module.exports = (sequelize, DataTypes) => {
  return sequelize.define('quote', {
    quote_id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      defaultValue: uuid(),
      allowNull: false,
    },
    quote: DataTypes.TEXT,
    last_emailed: DataTypes.DATE,
  }, {
    timestamps: false,
  })
};
