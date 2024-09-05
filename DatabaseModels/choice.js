const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Question = require("./question"); // Importing Question model

const Choice = sequelize.define("Choice", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  choice_text: {
    type: DataTypes.STRING(255),
    defaultValue: "No choice text",
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: "id",
    },
    onDelete: "CASCADE", // Add ON DELETE CASCADE here
  },
  is_answer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

// Define the associations with ON DELETE CASCADE
Question.hasMany(Choice, { foreignKey: "question_id", onDelete: "CASCADE" });
Choice.belongsTo(Question, { foreignKey: "question_id", onDelete: "CASCADE" });

module.exports = Choice;
