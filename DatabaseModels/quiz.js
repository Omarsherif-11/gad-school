const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Lesson = require("./lesson");
const Question = require("./question");

const Quiz = sequelize.define("Quiz", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  timer: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  take_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lesson_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Lesson,
      key: "id",
    },
    allowNull: false,
    onDelete: "CASCADE", // Add ON DELETE CASCADE here
  },
});

// Define the association with ON DELETE CASCADE
Quiz.belongsTo(Lesson, {
  foreignKey: "lesson_id",
  onDelete: "CASCADE",
});

Lesson.hasMany(Quiz, {
  foreignKey: "lesson_id",
  onDelete: "CASCADE",
});

module.exports = Quiz;
