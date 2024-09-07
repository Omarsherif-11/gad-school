const express = require("express");
const { Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const path = require("path");

const cookieParser = require("cookie-parser");

const config = require('../Backend/config.js');

const sequelize = new Sequelize("gad", "rahim", config.DB_PASSWORD, {
  host: "127.0.0.1",
  dialect: "mysql",
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

module.exports = sequelize;

const Student = require("../DatabaseModels/student.js");

const Abdo = require("../DatabaseModels/abdo.js");

const Chapter = require("../DatabaseModels/chapter.js");

const Choice = require("../DatabaseModels/choice.js");

const Lesson = require("../DatabaseModels/lesson.js");

const Question = require("../DatabaseModels/question.js");

const Quiz = require("../DatabaseModels/quiz.js");

const StudentLesson = require("../DatabaseModels/studentlesson.js");

const StudentAnswer = require("../DatabaseModels/studentanswer.js");

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}
testConnection();
initializeAbdo();
async function initializeAbdo() {
  try {
    const adminExists = await Abdo.findOne({
      where: { email: config.ADMIN_EMAIL },
    });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        config.ADMIN_PASSWORD,
        salt
      );

      await Abdo.create({
        email: config.ADMIN_EMAIL,
        password: hashedPassword,
        first_name: "Abdo",
        last_name: "Gad",
        mobile_num: "01234567890",
      });
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

const app = express();

app.use(bodyParser.json());

app.use("/api/videos", express.static(config.VIDEO_PATH));

app.use("/api/images", express.static(config.IMAGE_PATH));

app.use("/api/pdfs", express.static(config.PDF_PATH));

app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true }));

const router = require("./Routes/routes.js");

const cors = require("cors");


app.use(cors({
  origin: config.DOMAIN_ORIGIN,
  credentials: true
}));

const port = 5000;

app.get("/", async (req, res) => {
  try {
    res.send(await Lesson.findAll());
  } catch (err) {
    console.log(err.message);
  }
});

app.post("/api/signUp", router.signUpPost);
app.post("/api/verify", router.verify);
app.post("/api/resend-verification-code", router.resendVerificationCode);
app.post("/api/logIn", router.loginPost);
app.post("/api/logout", router.isAuthenticated, router.logoutPost);

app.post(
  "/api/addChapter",
  router.isAuthenticated,
  router.isAdmin,
  router.upload,
  router.addChapterPost
);
app.post(
  "/api/uploadQuiz",
  router.isAuthenticated,
  router.isAdmin,
  router.createQuizPost
);
app.get("/api/quiz/:id", router.isAuthenticated, (req, res) =>
  router.getQuiz(req, res)
);

app.post("/api/submitQuiz/:id", router.isAuthenticated, router.submitQuiz);

app.put(
  "/api/updateChapterPrice",
  router.isAuthenticated,
  router.isAdmin,
  router.updateChapterPricePut
);

app.get("/api/lessons/:id", router.isAuthenticated, router.getLesson);

app.get("/api/year/:id", router.getChaptersOfYear);

app.get("/api/chapters/:id", router.getLessonsOfChapter);

app.get("/api/lesson/quiz/:id", router.isAuthenticated, router.getQuizOfLesson);

app.get(
  "/api/quiz/review/:quizId",
  router.isAuthenticated,
  router.showLastQuizSubmissionGet
);
app.post("/api/createPayment", router.isAuthenticated, router.createPaymentPost);

app.post(
  "/api/transactionProcessedCallback",
  router.transactionProcessedCallbackPost
);

app.post(
  "/api/uploadLesson",
  router.isAuthenticated,
  router.isAdmin,
  router.upload,
  router.uploadLessonPost
);

app.delete(
  "/api/deleteLesson",
  router.isAuthenticated,
  router.isAdmin,
  router.deleteLessonDELETE
);

app.delete(
  "/api/deleteChapter",
  router.isAuthenticated,
  router.isAdmin,
  router.deleteChapterDELETE
);

app.post(
  "/api/addChoice",
  router.isAuthenticated,
  router.isAdmin,
  router.addChoice
);

app.delete(
  "/api/deleteQuestion",
  router.isAuthenticated,
  router.isAdmin,
  router.deleteQuestion
);

app.post(
  "/api/addQuestion",
  router.isAuthenticated,
  router.isAdmin,
  router.upload,
  router.addQuestion
);

app.put(
  "/api/updateQuestion",
  router.isAuthenticated,
  router.isAdmin,
  router.upload,
  router.updateQuestion
);

async function insertStudentLesson(studentId, lessonId, price, purchaseDate) {
  try {
    const newRecord = await StudentLesson.create({
      student_id: studentId,
      lesson_id: lessonId,
      price: price,
      purchase_date: purchaseDate,
    });

    console.log("Record inserted successfully:", newRecord);
  } catch (error) {
    console.error("Error inserting record:", error.message);
  }
}
// insertStudentLesson(14, 2, 32, new Date());

app.get(
  "/api/questionChoices/:id",
  router.isAuthenticated,
  router.isAdmin,
  router.getChoicesOfQuestion
);

app.patch(
  "/api/setAnswer",
  router.isAuthenticated,
  router.isAdmin,
  router.updateAnswerForQuestion
);

app.delete(
  "/api/deleteChoice",
  router.isAuthenticated,
  router.isAdmin,
  router.deleteChoice
);

app.patch(
  "/api/updateTimer",
  router.isAuthenticated,
  router.isAdmin,
  router.updateTimer
);

app.get(
  "/api/students-scores/:id",
  router.isAuthenticated,
  router.isAdmin,
  router.getStudetnsScoresOfQuiz
);

app.post(
  "/api/update-config",
  router.isAuthenticated,
  router.isAdmin,
  router.updateConfig
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
