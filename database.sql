DROP DATABASE IF EXISTS QUIZ;
CREATE DATABASE QUIZ;
use QUIZ;
DROP TABLE IF EXISTS gategories;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS answers;

CREATE TABLE IF NOT EXISTS categories(
	ID int(11) auto_increment,
	categoryName varchar(255),
	CONSTRAINT categories_PK PRIMARY KEY (ID)
);

CREATE TABLE IF NOT exists questions(
	ID int(11) auto_increment,
	question varchar(255),
	category int(11),
	CONSTRAINT questions_PK PRIMARY KEY (ID),
	CONSTRAINT category_FK FOREIGN KEY (category) references categories(ID)
);

CREATE TABLE IF NOT EXISTS answers(
	ID int(11) auto_increment,
	answer varchar(255),
	correct boolean,
	question int(11),
	CONSTRAINT answers_PK PRIMARY KEY (ID),
	CONSTRAINT question_FK FOREIGN KEY (question) REFERENCES questions(ID)
);