const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server"); // Adjust path as necessary
const Student = require("./student"); // Import Student model
const Quiz = require("./quiz"); // Import Quiz model

const StudentQuiz = sequelize.define(
  "StudentQuiz",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student,
        key: "id",
      },
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Quiz,
        key: "id",
      },
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "Student_Quiz",
    timestamps: false,
    uniqueKeys: {
      student_quiz_unique: {
        fields: ["student_id", "quiz_id"],
      },
    },
  }
);

// Add the `onDelete: 'CASCADE'` option to the associations
StudentQuiz.belongsTo(Student, {
  foreignKey: "student_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

StudentQuiz.belongsTo(Quiz, {
  foreignKey: "quiz_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

Student.hasMany(StudentQuiz, {
  foreignKey: "student_id",
  onDelete: "CASCADE",
});

Quiz.hasMany(StudentQuiz, {
  foreignKey: "quiz_id",
  onDelete: "CASCADE",
});

module.exports = StudentQuiz;
