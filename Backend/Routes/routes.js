const express = require("express");

const crypto = require("crypto");

const axios = require('axios');

const config = require('../config.js')

const sequelize = require("../server.js");

const Student = require("../../DatabaseModels/student.js");

const Abdo = require("../../DatabaseModels/abdo.js");

const Chapter = require("../../DatabaseModels/chapter.js");

const Choice = require("../../DatabaseModels/choice.js");

const Lesson = require("../../DatabaseModels/lesson.js");

const Question = require("../../DatabaseModels/question.js");

const Quiz = require("../../DatabaseModels/quiz.js");

const StudentLesson = require("../../DatabaseModels/studentlesson.js");

const StudentAnswer = require("../../DatabaseModels/studentanswer.js");

const StudentQuiz = require("../../DatabaseModels/studentquiz.js");

const multer = require("multer");

const path = require("path");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const API_URL = config.API_URL;

// const fs = require("fs/promises");

const secretKey = config.SECRET_KEY;

const fs = require("fs").promises;

const { Where } = require("sequelize/lib/utils");
const { promises } = require("dns");

const nodemailer = require("nodemailer");
const { getDefaultHighWaterMark } = require("stream");

function generateRandomSixDigit() {
  return Math.floor(100000 + Math.random() * 900000);
}
// MAIL SERVICE
async function sendVerificationEmail(email, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com", // Correct SMTP server
    port: 587, // Use 587 for TLS/STARTTLS or 465 for SSL/TLS
    secure: false,

    auth: {
      user: config.WEBSITE_EMAIL,
      pass: config.WEBSITE_EMAIL_PASSWORD,
    },
  });

  let mailOptions = {
    from: config.WEBSITE_EMAIL,
    to: email,
    subject: "Verify Your Email",
    text: `Your verification code is: ${code}`,
  };

  await transporter.sendMail(mailOptions);
}

// Middle ware for Authintication part usual student &  admin

function isAuthenticated(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (decoded.role === "student" && !decoded.is_verified) {
      return res
        .status(401)
        .json({ message: "Please verify your email first" });
    }

    req.user = decoded;
    next();
  });
}

async function getUserOfCookie(req) {
  const token = req.cookies.jwt;
  if (!token) {
    return null;
  }

  try {
    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });

    return decoded;
  } catch (err) {
    return null;
  }
}

function isAdmin(req, res, next) {
  console.log("i am here with omar");
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden" });
  }
}

async function verify(req, res) {
  const { email, code } = req.body;

  try {
    const student = await Student.findOne({
      where: {
        email: email,
      },
    });
    // error part
    if (!student) {
      throw new Error("You didn't signup");
    }
    if (student.verification_expiry < Date.now()) {
      throw new Error("The verification code expired");
    }
    if (student.verification_code !== code) {
      throw new Error("The verification code doesn't match");
    }

    // the student is verified

    student.is_verified = true;
    await student.save();

    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        mobile_num: student.mobile_num,
        first_name: student.first_name,
        last_name: student.last_name,
        role: "student",
        is_verified: student.is_verified,
      },
      secretKey,
      { expiresIn: "3d" }
    );
    console.log("here token:", token);
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: config.MODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000 * 72),
    });
    res.cookie("username", student.first_name + " " + student.last_name, {
      secure: config.MODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000 * 72),
    });
    res.cookie("email", student.email, {
      secure: config.MODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000 * 72),
    });

    res.cookie("role", "student", {
      secure: config.MODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 3600000 * 72),
    });
    res.cookie("mode", "dark", {
      secure: config.MODE_ENV === "production",
      sameSite: "strict",
    });
    console.log("here token:2");

    res.status(200).json({
      message: "Signup successful",
      token,
      data: {
        username: student.first_name + " " + student.last_name,
        role: "student",
      },
    });
  } catch (err) {
    res.status(403).json(err.message);
  }
}
async function resendVerificationCode(req, res) {
  const { email } = req.body;

  try {
    const student = await Student.findOne({
      where: {
        email: email,
      },
    });

    if (!student) {
      throw new Error("No account found with this email");
    }

    if (student.is_verified) {
      throw new Error("Account is already verified");
    }

    const code = generateRandomSixDigit();
    student.verification_code = code;

    student.verification_expiry = Date.now() + 3600000; // after 1h
    console.log("hre", code);
    await student.save();

    await sendVerificationEmail(email, code);

    res.status(200).json({ message: "Verification code resent successfully" });
  } catch (err) {
    res.status(403).json({ message: err.message });
  }
}

async function signUpPost(req, res) {
  try {
    const student = {
      email: req.body.email,
      password: req.body.password,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      mobile_num: req.body.phone,
    };
    const registeredStudent = await Student.findOne({
      where: {
        email: student.email,
      },
    });
    if (registeredStudent) {
      if (!registeredStudent.is_verified)
        throw new Error(
          "The email is registered but not verified, please verify your email first"
        );
      throw new Error("There is another account with this email");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(student.password, salt);
    student.password = hashedPassword;

    const code = generateRandomSixDigit();
    student.verification_code = code;

    await Student.create(student);
    sendVerificationEmail(student.email, code);
    res.status(200).json("successful sign up");
  } catch (err) {
    res.status(403).json(err.message);
  }
}

async function loginPost(req, res) {
  try {
    console.log("i am loginen in");

    console.log(config);
    let user = await Abdo.findOne({
      where: {
        email: req.body.email,
      },
    });

    let role = "admin";

    if (!user) {
      user = await Student.findOne({
        where: {
          email: req.body.email,
        },
      });
      role = "student";
    }

    if (!user) {
      throw new Error("No such user exists");
    }
    if (role === "student" && !user.is_verified) {
      throw new Error("please verify your email first");
    }

    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          mobile_num: user.mobile_num,
          first_name: user.first_name,
          last_name: user.last_name,
          role: role,
          is_verified: user.is_verified,
        },
        secretKey,
        { expiresIn: "3d" }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: config.MODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600000 * 72),
      });
      res.cookie("username", user.first_name + " " + user.last_name, {
        secure: config.MODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600000 * 72),
      });
      res.cookie("email", user.email, {
        secure: config.MODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600000 * 72),
      });
      res.cookie("role", role, {
        secure: config.MODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(Date.now() + 3600000 * 72),
      });
      res.cookie("mode", "dark", {
        secure: config.MODE_ENV === "production",
        sameSite: "strict",
      });
      res.status(201).json({
        message: "Login successful",
        token,
        // data: {
        //   username: user.first_name + " " + user.last_name,
        //   role: role,
        // },
      });
    } else {
      throw new Error("Invalid login credentials, please try again");
    }
  } catch (err) {
    res.status(401).json(err.message);
  }
}

async function logoutPost(req, res) {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: config.MODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("username", {
    secure: config.MODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("email", {
    httpOnly: true,
    secure: config.MODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("role", {
    secure: config.MODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("mode", {
    secure: config.MODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logout successful" });
}

async function addChapterPost(req, res) {
  try {
    const chapter = {
      name: req.body.name,
      year_of_study: req.body.year_of_study,
      price: req.body.price,
      image: req.files
        ? req.files.image
          ? req.files.image[0].filename
          : ""
        : "",
    };

    const createdChapter = await Chapter.create(chapter);

    res.status(200).json({
      message: "created chapter successfully",
      chapter_id: createdChapter.id,
    });
  } catch (err) {
    console.log(err);

    await fs.unlink(`${config.IMAGE_PATH}/${createdChapter.image}`).catch();

    res.status(403).json(err.message);
  }
}
async function updateChapterPricePut(req, res) {
  // Used when adding a lesson, the price of the lesson is used to increment the overall chapter price
  try {
    const { chapter_id, price_delta } = req.body;

    let chapter = await Chapter.findOne({
      where: {
        id: chapter_id,
      },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    const currentPrice = parseFloat(chapter.price);
    const delta = parseFloat(price_delta);

    if (isNaN(delta)) {
      return res.status(400).json({ error: "Invalid price delta" });
    }

    chapter.price = (currentPrice + delta).toFixed(2);
    await chapter.save();

    res
      .status(200)
      .json({ message: "Chapter price updated successfully", chapter });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
async function getLesson(req, res) {
  const lessonId = parseInt(req.params.id);

  try {
    const lesson = await Lesson.findByPk(lessonId);

    if (!lesson) {
      throw new Error("This lesson doesn't exist");
    }

    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAdmin) {
      const hasPurchased = await StudentLesson.findOne({
        where: {
          student_id: userId,
          lesson_id: lessonId,
        },
      });

      if (hasPurchased || lesson.price === 0) {
        // increamenting view count
        await Lesson.update(
          { view_count: lesson.view_count + 1 },
          { where: { id: lessonId } }
        );
        res.status(200).json(lesson);
      } else {
        throw new Error("You haven't bought this lesson");
      }
    } else {
      // now the admin is requesting
      res.status(200).json(lesson);
    }
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

async function getLessonsOfChapter(req, res) {
  try {
    const chapterId = parseInt(req.params.id);
    const user = await getUserOfCookie(req);
    const lessons = await Lesson.findAll({
      where: {
        chapter_id: chapterId,
      },
    });

    if (user && user.email === config.ADMIN_EMAIL && user.role === "admin")
      return res.status(201).json(lessons);

    const lessonsWithPurchaseInfo = await Promise.all(
      lessons.map(async (lesson) => {
        const isBought = user
          ? await StudentLesson.findOne({
              where: {
                student_id: user.id,
                lesson_id: lesson.id,
              },
            })
          : false;

        return {
          ...lesson.toJSON(),
          isBought: lesson.price === 0 || !!isBought, // Convert to boolean
        };
      })
    );

    res.status(200).json(lessonsWithPurchaseInfo);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "image") {
        cb(null, `${config.IMAGE_PATH}`);
      } else if (file.fieldname === "video") {
        cb(null, `${config.VIDEO_PATH}`);
      }
    },
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${Math.floor(
        Math.random() * 100000000
      )}${path.extname(file.originalname)}`;
      cb(null, fileName);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.fieldname === "image") {
      imageFileFilter(file, cb);
    } else if (file.fieldname === "video") {
      videoFileFilter(file, cb);
    }
  },
}).fields([
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

function videoFileFilter(file, cb) {
  const filetypes = /mp4|mov|avi|mkv|quicktime|hevc|m4v/; //regex
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Videos Only!");
  }
}

function imageFileFilter(file, cb, mimeType) {
  const filetypes = /jpeg|jpg|png|gif|heic|tiff/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Invalid file type."));
  }
}

////////////////////////////////
async function createQuizPost(req, res, next) {
  // treated as middle ware for image upload
  const { lessonId, title, duration, questions } = req.body;
  try {
    const lesson = await Lesson.findByPk(lessonId);
    if (!lesson) {
      return res.status(404).json({ error: "Please add a Lesson First" });
    }

    const quiz = await Quiz.create({
      name: title,
      timer: parseInt(duration),
      score: questions.length,
      lesson_id: lessonId,
    });

    const questionPromises = questions.map(async (questionData) => {
      const question = await Question.create({
        text: questionData.text,
        quiz_id: quiz.id,
      });

      let answer_id = -1;
      const choicePromises = questionData.choices.map(async (_choice) => {
        const choice = await Choice.create({
          choice_text: _choice.text,
          is_answer: _choice.isCorrect,
          question_id: question.id,
        });

        if (_choice.isCorrect) {
          answer_id = choice.id;
        }

        return choice;
      });

      await Promise.allSettled(choicePromises);
      if (answer_id !== -1) {
        question.choice_answer_id = answer_id;
        await question.save();
      }

      return { id: question.id, image: questionData.image };
    });

    req.questionsData = await Promise.allSettled(questionPromises);

    next();
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
}

async function getQuizOfLesson(req, res) {
  // lesson/quiz/:lessonId
  const lessonId = req.params.id;
  const studentId = req.user.id;
  try {
    const quiz = await Quiz.findByPk(lessonId, {
      include: [
        {
          model: Question,
          include: [Choice],
          required: false,
        },
      ],
    });

    if (req.user.role === "admin") {
      if (!quiz) {
        const quiz2 = await Quiz.create({
          name: "title",
          timer: 30,
          lesson_id: lessonId,
        });
        return res.json(quiz2);
      }
      return res.json(quiz);
    }

    console.log("quiz is:", quiz);
    let studentQuiz = await StudentQuiz.findOne({
      where: {
        student_id: studentId,
        quiz_id: quiz.id,
      },
    });
    let retQuiz;
    if (studentQuiz)
      retQuiz = { ...quiz.dataValues, student_score: studentQuiz.score };
    else retQuiz = { ...quiz.dataValues };
    return res.json(retQuiz);
  } catch (error) {
    console.error("Error retrieving quiz:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getQuiz(req, res) {
  // quiz/:id
  const quizId = req.params.id;
  const userId = req.user.id;

  try {
    const quiz = await Quiz.findByPk(quizId, {
      include: [
        {
          model: Question,
          include: [Choice],
          required: false,
        },
      ],
    });

    if (req.user.role === "admin") return res.status(200).json(quiz);

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const hasPurchased = await StudentLesson.findOne({
      where: {
        student_id: userId,
        lesson_id: quiz.lesson_id,
      },
    });

    if (hasPurchased) {
      await quiz.update(
        { take_count: quiz.take_count + 1 },
        { where: { id: quizId } }
      );
      console.log("quiz is: ", quiz);
      console.log("questoins are: ", quiz.dataValues.Questions);
      res.status(200).json(quiz);
    }
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({ error: "Error fetching quiz" });
  }
}
async function submitQuiz(req, res) {
  const { answers } = req.body; // Expected to be a list of maps { question_id, answer_id }
  const quizId = parseInt(req.params.id, 10);
  const studentId = req.user.id;

  try {
    const quiz = await Quiz.findByPk(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    const promises = answers.map(async ({ question_id, answer_id }) => {
      const questionId = parseInt(question_id, 10);
      const choiceId = answer_id;

      let studentAnswer = await StudentAnswer.findOne({
        where: {
          student_id: studentId,
          quiz_id: quizId,
          question_id: questionId,
        },
      });

      if (studentAnswer) {
        studentAnswer.choice_id = choiceId;
        await studentAnswer.save();
      } else {
        await StudentAnswer.create({
          student_id: studentId,
          quiz_id: quizId,
          question_id: questionId,
          choice_id: choiceId,
        });
      }
    });

    await Promise.allSettled(promises);

    // Calculate student score
    const studentAnswers = await StudentAnswer.findAll({
      where: {
        student_id: studentId,
        quiz_id: quizId,
      },
    });

    let score = 0;

    for (const studentAnswer of studentAnswers) {
      const correctChoice = await Choice.findOne({
        where: {
          question_id: studentAnswer.question_id,
          is_answer: true,
        },
      });

      if (correctChoice && correctChoice.id === studentAnswer.choice_id) {
        score++;
      }
    }

    let studentQuiz = await StudentQuiz.findOne({
      where: {
        student_id: studentId,
        quiz_id: quizId,
      },
    });

    if (studentQuiz) {
      studentQuiz.score = score;
      await studentQuiz.save();
    } else {
      await StudentQuiz.create({
        student_id: studentId,
        quiz_id: quizId,
        score: score,
      });
    }

    res.status(200).json({
      success: true,
      message: "Answers submitted successfully",
      score: score,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res
      .status(500)
      .json({ error: `Error submitting answers: ${error.message}` });
  }
}

async function showLastQuizSubmissionGet(req, res) {
  const quizId = parseInt(req.params.quizId, 10);
  const studentId = req.user.id;

  if (isNaN(quizId)) {
    return res.status(400).json({ error: "Invalid quiz ID" });
  }

  try {
    const quiz = await Quiz.findByPk(quizId, {
      include: {
        model: Question,
        include: [
          {
            model: Choice,
            as: "Choices",
          },
          {
            model: StudentAnswer,
            as: "StudentAnswers",
            where: {
              student_id: studentId,
            },
            required: false,
          },
        ],
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Format the quiz and questions with student answers
    const formattedQuiz = {
      id: quiz.id,
      name: quiz.name,
      timer: quiz.timer,
      lesson_id: quiz.lesson_id,
      questions: quiz.Questions.map((question) => ({
        id: question.id,
        text: question.text,
        image: question.image,
        choices: question.Choices.map((choice) => ({
          id: choice.id,
          text: choice.choice_text,
          is_answer: choice.is_answer,
        })),
        studentAnswer: question.StudentAnswers.length
          ? question.StudentAnswers[0].choice_id
          : null,
      })),
    };

    res.status(200).json({ success: true, quiz: formattedQuiz });
  } catch (error) {
    console.error("Error fetching the last submitted quiz:", error);
    res.status(500).json({ error: "Error fetching the last submitted quiz" });
  }
}

async function uploadLessonPost(req, res) {
  const name = req.body.name;

  const description = req.body.description;

  const view_count = parseInt(req.body.view_count);

  const chapter = parseInt(req.body.chapter);

  const price = parseFloat(req.body.price);

  const lesson = req.body.lesson;

  const videoExtension = req.body.videoExtension;

  const imageExtension = req.body.imageExtension;

  const video = req.files.video[0].filename;

  const image = req.files.image[0].filename;

  const brief = req.body.brief;

  const transaction = await sequelize.transaction();

  try {
    const newLesson = await Lesson.create(
      {
        name,
        description,
        view_count,
        chapter_id: chapter,
        price,
        video,
        image,
        brief,
        number: parseInt(lesson),
      },
      { transaction }
    );

    const newQuiz = await Quiz.create(
      {
        id: newLesson.id,
        name,
        timer: 30,
        lesson_id: newLesson.id,
        score: 0,
      },
      { transaction }
    );

    console.log(newLesson.dataValues.name);

    await transaction.commit();

    res.status(200).json(newLesson);
  } catch (err) {
    try {
      await transaction.rollback();

      await fs.unlink(`${config.VIDEO_PATH}/${video}`).catch();

      await fs.unlink(`${config.IMAGE_PATH}/${image}`).catch();
    } catch (err) {}
    return res.status(400).json(err.message);
  }
}

const api_key = config.PAYMENT_API_KEY;
const integration_id_card = config.INTEGRATION_ID_CARD;
const integration_id_wallet = config.INTEGRATION_ID_WALLET;
const my_hmac = config.MY_HMAC;

async function createPaymentPost(req, res) {
  const { lessons, paymentMethod, phoneNumber, yearId, chapterId } = req.body;
  const { email, first_name, last_name, mobile_num, id } = req.user;
  const studentId = id;

  try {
    const totalAmount =
      lessons.reduce((sum, lesson) => sum + parseFloat(lesson.price), 0) * 100;

    const authResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/auth/tokens",
      { api_key: api_key }
    );
    const uniqueOrderId = `${studentId}*${yearId}*${chapterId}*${Math.random()}`;
    const authToken = authResponse.data.token;

    const orderResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/ecommerce/orders",
      {
        auth_token: authToken,
        delivery_needed: false,
        amount_cents: totalAmount,
        currency: "EGP",
        items: lessons.map((lesson) => ({
          name: `Lesson ${lesson.id}`,
          amount_cents: parseFloat(lesson.price) * 100,
          quantity: 1,
        })),
        merchant_order_id: uniqueOrderId,
      }
    );
    const orderId = orderResponse.data.id;
    const integration_id =
      paymentMethod === "wallet" ? integration_id_wallet : integration_id_card;
    const paymentKeyResponse = await axios.post(
      "https://accept.paymobsolutions.com/api/acceptance/payment_keys",
      {
        auth_token: authToken,
        amount_cents: totalAmount,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: email,
          floor: "NA",
          first_name: first_name,
          street: "NA",
          building: "NA",
          phone_number: mobile_num,
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: last_name,
          state: "NA",
        },
        currency: "EGP",
        integration_id: integration_id,
      }
    );

    const paymentKey = paymentKeyResponse.data.token;

    if (paymentMethod === "wallet") {
      const walletResponse = await processMobileWalletPayment(
        paymentKey,
        phoneNumber
      );
      console.log("here at wallet:", walletResponse);
      res.json({ walletResponse });
    } else {
      res.json({ paymentKey });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating payment");
  }
}

async function processMobileWalletPayment(paymentKey, phoneNumber) {
  const paymentData = {
    source: {
      identifier: phoneNumber,
      subtype: "WALLET",
    },
    payment_token: paymentKey,
  };

  try {
    const response = await axios.post(
      "https://accept.paymob.com/api/acceptance/payments/pay",
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error("Error processing wallet payment:", error);
    throw error;
  }
}

function validateHmac(receivedHmac, dataToValidate) {
  try {
    const concatenatedString = Object.keys(dataToValidate)
      .sort()
      .map((key) => dataToValidate[key])
      .join("");
    console.log("concat string: ", concatenatedString);

    const generatedHmac = crypto
      .createHmac("sha512", my_hmac)
      .update(concatenatedString)
      .digest("hex");
    console.log("compare");
    console.log(receivedHmac);
    console.log(generatedHmac);
    return receivedHmac === generatedHmac;
  } catch (err) {
    return false;
  }
}

// async function transactionResponseCallbackGet(req, res) {
//   const receivedHmac = req.query.hmac;
//   const { merchant_order_id, amount_cents, success, ...otherParams } =
//     req.query;

//   const dataToValidate = {
//     amount_cents,
//     created_at: req.query.created_at,
//     currency: req.query.currency,
//     error_occured: req.query.error_occured,
//     has_parent_transaction: req.query.has_parent_transaction,
//     id: req.query.id,
//     integration_id: req.query.integration_id,
//     is_3d_secure: req.query.is_3d_secure,
//     is_auth: req.query.is_auth,
//     is_capture: req.query.is_capture,
//     is_refunded: req.query.is_refunded,
//     is_standalone_payment: req.query.is_standalone_payment,
//     is_voided: req.query.is_voided,
//     order_id: req.query.order,
//     owner: req.query.owner,
//     pending: req.query.pending,
//     source_data_pan: req.query["source_data.pan"],
//     source_data_sub_type: req.query["source_data.sub_type"],
//     source_data_type: req.query["source_data.type"],
//     success,
//   };

//   const isValidHmac = validateHmac(receivedHmac, dataToValidate);
//   if (!isValidHmac) {
//     return res.status(400).send("Invalid HMAC signature");
//   }

//   const [studentIdStr, lessonIdString] = merchant_order_id.split("*");
//   const lessonIdsStr = lessonIdString.split("-");
//   lessonIdsStr.pop();
//   const studentId = parseInt(studentIdStr, 10);
//   const lessonIds = lessonIdsStr.map((idStr) => parseInt(idStr, 10));

//   res.status(200).message("Successful payment");
// }

async function transactionProcessedCallbackPost(req, res) {
  try {
    const receivedHmac = req.query.hmac;
    const { obj } = req.body;
    console.log("Body is: ", req.body);

    if (obj && obj.success && obj.order) {
      const dataToValidate = {
        amount_cents: obj.amount_cents,
        created_at: obj.created_at,
        currency: obj.currency,
        error_occured: obj.error_occured,
        has_parent_transaction: obj.has_parent_transaction,
        id: obj.id,
        integration_id: obj.integration_id,
        is_3d_secure: obj.is_3d_secure,
        is_auth: obj.is_auth,
        is_capture: obj.is_capture,
        is_refunded: obj.is_refunded,
        is_standalone_payment: obj.is_standalone_payment,
        is_voided: obj.is_voided,
        order_id: obj.order.id,
        owner: obj.owner,
        pending: obj.pending,
        source_data_pan: obj.source_data.pan,
        source_data_sub_type: obj.source_data.sub_type,
        source_data_type: obj.source_data.type,
        success: obj.success,
      };
      console.log("Data prepared for validation");

      if (!validateHmac(receivedHmac, dataToValidate)) {
        return res.status(400).send("Invalid HMAC signature");
      }

      const merchant_order_id = obj.order.merchant_order_id;
      const theList = merchant_order_id.split("*");
      const studentId = parseInt(theList[0], 10);
      const itemsList = obj.order.items;
      const lessonIds = itemsList.map((item) => {
        const lessonId = parseInt(item.name.replace("Lesson ", ""), 10);
        return lessonId;
      });

      const promises = lessonIds.map((lessonId) =>
        StudentLesson.create({
          student_id: studentId,
          lesson_id: lessonId,
          price: obj.amount_cents / (lessonIds.length * 100),
          purchase_date: new Date(),
        })
      );

      await Promise.all(promises);
      console.log("Processed callback worked");

      return res.status(200).send("Transaction response handled successfully");
    } else {
      return res.status(400).send("Invalid webhook payload");
    }
  } catch (err) {
    console.error("Error in transaction processed callback:", err);
    return res.status(400).send("Error processing transaction");
  }
}

async function deleteLessonDELETE(req, res) {
  const lesson_id = parseInt(req.body.lesson);

  console.log(lesson_id);

  try {
    const lesson = await Lesson.findByPk(lesson_id);

    const questions = await Question.findAll({ where: { quiz_id: lesson_id } });

    let deletePromises = questions.map(async (question) => {
      console.log(question.image);

      return fs.unlink(`${config.IMAGE_PATH}/${question.image}`).catch();
    });

    const image = lesson.image;

    const video = lesson.video;

    deletePromises.push(fs.unlink(`${config.IMAGE_PATH}/${image}`).catch());

    deletePromises.push(fs.unlink(`${config.VIDEO_PATH}/${video}`).catch());

    await Promise.allSettled(deletePromises);

    await Lesson.destroy({ where: { id: lesson_id } });

    res.status(200).json("Success");
  } catch (err) {
    res.status(503).json(err.message);
  }
}

async function deleteChapterDELETE(req, res) {
  const chapter = req.body.chapter;

  try {
    const lessons = await Lesson.findAll({ where: { chapter_id: chapter } });

    const deletePromises = lessons.map(async (lesson) => {
      const lesson_id = lesson.id;

      return axios.delete(`${API_URL}/deleteLesson`, {
        withCredentials: true,
        data: { lesson: lesson_id },
        headers: {
          Cookie: `jwt=${req.cookies.jwt}`,
        },
      });
    });

    await Promise.all(deletePromises);

    console.log(1);

    const findFromDB = await Chapter.findByPk(chapter);

    const image = findFromDB.image;

    try {
      await fs.access(`${config.IMAGE_PATH}/${image}`);

      await fs.unlink(`${config.IMAGE_PATH}/${image}`);
    } catch (err) {
      console.log(err.message);
    }

    await Chapter.destroy({ where: { id: chapter } });

    res.status(200).json("All lessons deleted successfuly");
  } catch (err) {
    console.error(err.response);

    res.status(500).json(err.message);
  }
}
async function getChaptersOfYear(req, res) {
  const year = parseInt(req.params.id, 10);

  try {
    const result = await Chapter.findAll({
      where: { year_of_study: year },
    });

    if (!result) {
      throw new Error("No chapters in this year yet!");
    }

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(404).json(err.message);
  }
}

async function getQuestionsOfQuiz(req, res) {
  const id = parseInt(req.params.id);

  try {
    const questions = await Question.findAll({ where: { quiz_id: id } });

    res.status(200).json(questions);
  } catch (err) {
    res.status(400).json(err.message);
  }
}

async function getChoicesOfQuestion(req, res) {
  const id = req.params.id;

  try {
    const choices = await Choice.findAll({ where: { question_id: id } });

    res.status(200).json(choices);
  } catch (err) {
    res.status(400).json(err.message);
  }
}

async function addChoice(req, res) {
  const text = req.body.text;

  const question_id = req.body.question_id;

  try {
    const response = await Choice.create({
      choice_text: text,
      question_id,
    });

    return res.status(200).json(response);
  } catch (err) {
    return res.status(400).json(err.message);
  }
}

async function deleteQuestion(req, res) {
  const id = req.body.id;

  const transaction = await sequelize.transaction();

  try {
    const thisQuestion = await Question.findByPk(id);

    try {
      await fs.unlink(`${config.IMAGE_PATH}/${thisQuestion.image}`);
    } catch (err) {
      console.log(err.message);
    }

    const deletedQuestion = await Question.destroy(
      { where: { id } },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json("Deleted Successfully");
  } catch (err) {
    await transaction.rollback();

    res.status(500).json(err.message);
  }
}

async function addQuestion(req, res) {
  console.log("this is the body", req.body);
  const text = req.body.text;

  const quiz_id = req.body.quiz_id;

  console.log("text is", text);
  console.log("quiz id", quiz_id);
  const image = req.files
    ? req.files.image
      ? req.files.image[0].filename
      : ""
    : "";

  try {
    const response = await Question.create({
      text,
      quiz_id,
      image,
    });

    const updateQuizScore = await Quiz.increment("score", {
      by: 1,
      where: {
        id: quiz_id,
      },
    });

    res.status(200).json(response);
  } catch (err) {
    await fs.unlink(`${config.IMAGE_PATH}/${image}`).catch();

    res.status(400).json(err.message);
  }
}

async function upsertQuestion(id, text, quiz_id, image) {
  try {
    let question;
    if (id) {
      // update
      question = await Question.findByPk(id);
      if (!question) {
        throw new Error("Question not found");
      }
      if (image && image !== null) await question.update({ text, image });
      else await question.update({ text });
    } else {
      question = await Question.create({ text, quiz_id, image });
    }
    return question;
  } catch (error) {
    throw new Error(`Error upserting question: ${error.message}`);
  }
}
async function upsertChoices(questionId, choices) {
  try {
    const choicePromises = choices.map(async (choiceData) => {
      if (choiceData.id) {
        const choice = await Choice.findByPk(choiceData.id);
        if (choice) {
          await choice.update({
            choice_text: choiceData.choice_text,
            is_answer: choiceData.is_answer,
          });
        }
      } else {
        // Create new choice
        await Choice.create({
          choice_text: choiceData.choice_text,
          is_answer: choiceData.is_answer,
          question_id: questionId,
        });
      }
    });
    await Promise.all(choicePromises);
  } catch (error) {
    throw new Error(`Error upserting choices: ${error.message}`);
  }
}

async function updateQuestion(req, res) {
  const { id, text, quiz_id, choices } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const question = await upsertQuestion(id, text, quiz_id, image);

    if (choices && choices.length > 0) {
      await upsertChoices(question.id, choices);
    }

    res.json({ message: "Question updated successfully", question });
  } catch (error) {
    console.error("Error updating question:", error);
    res.status(500).json({ message: "Error updating question", error });
  }
}

async function updateAnswerForQuestion(req, res) {
  const questionId = parseInt(req.body.id);

  const answerIndex = parseInt(req.body.answerIndex);

  try {
    const choices = await Choice.findAll({
      where: { question_id: questionId },
    });

    const response = await Question.update(
      { choice_answer_id: answerIndex },
      { where: { id: questionId } }
    );

    const resetChoices = await Choice.update(
      { is_answer: false },
      { where: { question_id: questionId } }
    );

    const correctAnswer = await Choice.update(
      { is_answer: true },
      { where: { id: choices[answerIndex - 1].id } }
    );

    if (response) throw new Error("Update not successful, try again");

    return res.status(200).json(response);
  } catch (err) {
    return res.status(403).json(err.message);
  }
}

async function deleteChoice(req, res) {
  const choiceId = req.body.id;

  try {
    const choice = await Choice.findByPk(choiceId);

    const updateQuestion = Question.update(
      { choice_answer_id: 0 },
      { where: { id: choice.question_id } }
    );

    const disableChoices = await Choice.update(
      { is_answer: false },
      { where: { question_id: choice.question_id } }
    );

    const deletedChoice = await Choice.destroy({ where: { id: choiceId } });

    return res.status(200).json(deleteChoice);
  } catch (err) {
    return res.status(403).json(err.message);
  }
}

async function updateTimer(req, res) {
  const id = req.body.id;

  const timer = req.body.timer;

  try {
    await Quiz.update({ timer: timer }, { where: { id: id } });

    return res.status(200).json("success");
  } catch (err) {
    console.log(err);
  }
}

async function getStudetnsScoresOfQuiz(req, res) {
  const quizId = parseInt(req.params.id);
  try {
    console.log("you man");
    const studentsWithScores = await Student.findAll({
      include: [
        {
          model: StudentQuiz,
          where: { quiz_id: quizId },
          include: [
            {
              model: Quiz,
            },
          ],
          attributes: ["score"],
        },
      ],
    });
    console.log("here     ", studentsWithScores);

    res.json(studentsWithScores);
  } catch (error) {
    console.error("Error fetching students with scores:", error);
    res.status(500).send("Internal Server Error");
  }
}

async function updateConfig(req, res) {
  try {
    const { key, value } = req.body;

    if (!key || !value) {
      return res.status(400).send({ message: "Key and value are required." });
    }

    config[key] = value;

    const envFilePath = ".env";
    let envFileContent = await fs.readFile(envFilePath, "utf-8");

    const envLines = envFileContent.split("\n");
    let keyExists = false;

    const updatedEnvLines = envLines.map((line) => {
      if (line.startsWith(`${key}=`)) {
        keyExists = true;
        return `${key}="${value}"`;
      }
      return line;
    });

    if (!keyExists) {
      updatedEnvLines.push(`${key}="${value}"`);
    }

    await fs.writeFile(envFilePath, updatedEnvLines.join("\n"));

    res.status(200).send({ message: "Configuration updated successfully!" });
  } catch (error) {
    console.error("Error updating configuration:", error);
    res
      .status(500)
      .send({ message: "An error occurred while updating the configuration." });
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  verify,
  resendVerificationCode,
  signUpPost,
  loginPost,
  logoutPost,
  addChapterPost,
  updateChapterPricePut,
  getLesson,
  createQuizPost,
  getQuizOfLesson,
  getQuiz,
  submitQuiz,
  showLastQuizSubmissionGet,
  uploadLessonPost,
  createPaymentPost,
  transactionProcessedCallbackPost,
  // transactionResponseCallbackGet,
  getLessonsOfChapter,
  deleteLessonDELETE,
  deleteChapterDELETE,
  getChaptersOfYear,
  getQuestionsOfQuiz,
  getChoicesOfQuestion,
  addChoice,
  deleteQuestion,
  addQuestion,
  updateQuestion,
  updateAnswerForQuestion,
  upload,
  deleteChoice,
  updateTimer,
  getStudetnsScoresOfQuiz,
  updateConfig,
};
