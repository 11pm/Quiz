DROP DATABASE IF EXISTS QUIZ;
CREATE DATABASE QUIZ;
use QUIZ;
DROP TABLE IF EXISTS leaderboards;

CREATE table leaderboards(
	id int auto_increment,
	username varchar(255),
	score int,
	CONSTRAINT leaderboards_PK primary key(id)
);