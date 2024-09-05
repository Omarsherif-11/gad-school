const { DataTypes } = require("sequelize");
const sequelize = require("../Backend/server");
const Student = require("./student"); // Importing Student model
const Lesson = require("./lesson"); // Importing Lesson model

const StudentLesson = sequelize.define(
  "StudentLesson",
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Student,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
    lesson_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Lesson,
        key: "id",
      },
      onDelete: "CASCADE", // Add ON DELETE CASCADE here
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    purchase_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "Student_Takes_Lesson",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "lesson_id"],
      },
    ],
  }
);

// Define associations with ON DELETE CASCADE
StudentLesson.belongsTo(Student, {
  foreignKey: "student_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

StudentLesson.belongsTo(Lesson, {
  foreignKey: "lesson_id",
  targetKey: "id",
  onDelete: "CASCADE",
});

Student.hasMany(StudentLesson, {
  foreignKey: "student_id",
  onDelete: "CASCADE",
});

Lesson.hasMany(StudentLesson, {
  foreignKey: "lesson_id",
  onDelete: "CASCADE",
});

module.exports = StudentLesson;
