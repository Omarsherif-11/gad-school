const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Chapter = require("./chapter"); // Importing Chapter model

const Lesson = sequelize.define("Lesson", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  description: {
    type: DataTypes.TEXT,
  },
  video: {
    type: DataTypes.STRING(255),
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  chapter_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Chapter,
      key: "id",
    },
    onDelete: "CASCADE", // Add ON DELETE CASCADE here
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.0,
  },
  number: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  image: {
    type: DataTypes.STRING(255),
  },
  brief: {
    type: DataTypes.TEXT,
  },
});

// Define the association with ON DELETE CASCADE
Chapter.hasMany(Lesson, {
  foreignKey: "chapter_id",
  onDelete: "CASCADE",
});

Lesson.belongsTo(Chapter, {
  foreignKey: "chapter_id",
  onDelete: "CASCADE",
});

module.exports = Lesson;
