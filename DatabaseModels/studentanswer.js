const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Student = require("./student"); // Importing Student model
const Question = require("./question"); // Importing Question model
const Choice = require("./choice"); // Importing Choice model
const Quiz = require("./quiz"); // Importing Quiz model

const StudentAnswer = sequelize.define(
  "StudentAnswer",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Quiz,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
    question_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Question,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
    choice_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Choice,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
  },
  {
    tableName: "Student_Answer",
    timestamps: false,
    uniqueKeys: {
      student_quiz_question_unique: {
        fields: ["student_id", "quiz_id", "question_id"],
      },
    },
  }
);

// Define associations with ON DELETE CASCADE
StudentAnswer.belongsTo(Student, {
  foreignKey: "student_id",
  onDelete: "CASCADE",
});

StudentAnswer.belongsTo(Quiz, {
  foreignKey: "quiz_id",
  onDelete: "CASCADE",
});

StudentAnswer.belongsTo(Question, {
  foreignKey: "question_id",
  onDelete: "CASCADE",
});

StudentAnswer.belongsTo(Choice, {
  foreignKey: "choice_id",
  onDelete: "CASCADE",
});

Student.hasMany(StudentAnswer, {
  foreignKey: "student_id",
  onDelete: "CASCADE",
});

Quiz.hasMany(StudentAnswer, {
  foreignKey: "quiz_id",
  onDelete: "CASCADE",
});

Question.hasMany(StudentAnswer, {
  foreignKey: "question_id",
  onDelete: "CASCADE",
});

Choice.hasMany(StudentAnswer, {
  foreignKey: "choice_id",
  onDelete: "CASCADE",
});

module.exports = StudentAnswer;
