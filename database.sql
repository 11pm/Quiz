DROP DATABASE IF EXISTS QUIZ;
CREATE DATABASE QUIZ;
use QUIZ;
DROP TABLE IF EXISTS leaderboards;

CREATE table leaderboards(
	id int auto_increment,
	username varchar(255),
	score int,
	category varchar(255),
	time_added timestamp,
	CONSTRAINT leaderboards_PK primary key(id)
);