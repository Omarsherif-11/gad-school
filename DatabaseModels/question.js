const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Quiz = require("./quiz");

const Question = sequelize.define("Question", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  text: {
    type: DataTypes.TEXT,
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Quiz,
      key: "id",
    },
    onDelete: "CASCADE", // Add ON DELETE CASCADE here
  },
  choice_answer_id: {
    type: DataTypes.INTEGER,
  },
});

// Define the associations with ON DELETE CASCADE
Quiz.hasMany(Question, { foreignKey: "quiz_id", onDelete: "CASCADE" });
Question.belongsTo(Quiz, { foreignKey: "quiz_id", onDelete: "CASCADE" });

module.exports = Question;
