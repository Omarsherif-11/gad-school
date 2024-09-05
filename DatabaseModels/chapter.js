const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");

const Chapter = sequelize.define("Chapter", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  year_of_study: {
    type: DataTypes.INTEGER,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2), // Adjust the precision and scale as needed
    allowNull: false, // Ensure price is always provided
    defaultValue: 0.0, // Set a default value if needed
  },
  image: {
    type: DataTypes.STRING(255)
  }
});

module.exports = Chapter;
