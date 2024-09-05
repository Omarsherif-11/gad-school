drop database gad;
create database gad;
use gad;

-- Create Student table
CREATE TABLE Student (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    mobile_num VARCHAR(20) NOT NULL
);


CREATE TABLE Chapter (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  year_of_study INT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.0
);



-- Create Lesson table
CREATE TABLE Lesson (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    video VARCHAR(255),
    view_count INT DEFAULT 0,
    chapter_id INT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    number INT,
    FOREIGN KEY (chapter_id) REFERENCES Chapter(id) 
);

-- Create Quiz table
CREATE TABLE Quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    timer INT,
    score INT,
    take_count INT DEFAULT 0,
    lesson_id INT,
    FOREIGN KEY (lesson_id) REFERENCES Lesson(id)
);

CREATE TABLE Question (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT,
    quiz_id INT,
    -- choice_answer_id INT,
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id)
);

-- Create Choice table
CREATE TABLE Choice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    choice_text VARCHAR(255) DEFAULT 'No choice text',
    question_id INT,
    is_answer BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (question_id) REFERENCES Question(id)
);

-- Create Abdo table
CREATE TABLE Abdo (
    id INT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Create Student_Lesson table
CREATE TABLE Student_Lesson (
    student_id INT,
    lesson_id INT,
    PRIMARY KEY (student_id, lesson_id),
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (lesson_id) REFERENCES Lesson(id)
);

-- Create Student_Answer table
CREATE TABLE Student_Answer (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    quiz_id INT,
    question_id INT,
    choice_id INT,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (question_id) REFERENCES Question(id),
    FOREIGN KEY (choice_id) REFERENCES Choice(id),
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id),
    UNIQUE (student_id, quiz_id, question_id)
);

CREATE TABLE Student_Quiz (
     id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    quiz_id INT,
    score INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (quiz_id) REFERENCES Quiz(id)

);