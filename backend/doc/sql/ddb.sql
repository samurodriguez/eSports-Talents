CREATE SCHEMA esports_talents_test;

USE esports_talents_test;

CREATE TABLE team (
team_id INT NOT NULL AUTO_INCREMENT,
team_name VARCHAR(50) NOT NULL,
team_email VARCHAR(100) NOT NULL,
team_password VARCHAR(255) NOT NULL,
foundation_date DATE,
team_logo VARCHAR(255),
province VARCHAR(40),
tel CHAR(9),
PRIMARY KEY (team_id)
);

CREATE TABLE `user` (
usr_id INT NOT NULL AUTO_INCREMENT,
usr_role ENUM('amateur', 'player', 'scout') NOT NULL,
usr_name VARCHAR(40) NOT NULL,
usr_lastname VARCHAR(100),
usr_email VARCHAR(100) NOT NULL,
usr_nickname VARCHAR(40) NOT NULL,
usr_password VARCHAR(255) NOT NULL,
usr_birth DATE,
tel CHAR(9),
province VARCHAR(40),
usr_photo VARCHAR(255),
usr_bio VARCHAR(500),
fav_team VARCHAR(40),
usr_team INT,
usr_position ENUM('top', 'jungle', 'mid', 'adc', 'support'),
usr_rank VARCHAR(20),
PRIMARY KEY (usr_id),
FOREIGN KEY (usr_team) REFERENCES team (team_id)
);

CREATE TABLE post (
post_id INT NOT NULL AUTO_INCREMENT,
usr_id INT NOT NULL,
post_title VARCHAR(255) NOT NULL,
post_content VARCHAR(500) NOT NULL,
PRIMARY KEY (post_id),
FOREIGN KEY (usr_id) REFERENCES `user` (usr_id)
);

CREATE TABLE user_likes (
usr_id INT NOT NULL,
post_id INT NOT NULL,
PRIMARY KEY (usr_id, post_id),
FOREIGN KEY (usr_id) REFERENCES `user` (usr_id),
FOREIGN KEY (post_id) REFERENCES post (post_id)
);

create table `comment` (
cmnt_id INT NOT NULL AUTO_INCREMENT,
usr_id INT NOT NULL,
cmnt_content VARCHAR(255),
post_replied INT,
cmnt_replied INT,
PRIMARY KEY (cmnt_id),
FOREIGN KEY (usr_id) REFERENCES `user` (usr_id),
FOREIGN KEY (post_replied) REFERENCES post (post_id),
FOREIGN KEY (cmnt_replied) REFERENCES `comment`(cmnt_id)
);

CREATE TABLE user_shares (
usr_id INT NOT NULL,
post_id INT NOT NULL,
PRIMARY KEY (usr_id, post_id),
FOREIGN KEY (usr_id) REFERENCES `user` (usr_id),
FOREIGN KEY (post_id) REFERENCES post (post_id)
);

CREATE TABLE recruitment_request (
scout_id INT NOT NULL,
player_id INT NOT NULL,
req_date DATE NOT NULL,
req_title VARCHAR(255),
req_content VARCHAR(500) NOT NULL,
PRIMARY KEY (scout_id, player_id),
FOREIGN KEY (scout_id) REFERENCES `user` (usr_id),
FOREIGN KEY (player_id) REFERENCES `user` (usr_id)
);

CREATE TABLE user_follows (
usr_following INT NOT NULL,
usr_followed INT NOT NULL,
PRIMARY KEY (usr_following, usr_followed),
FOREIGN KEY (usr_following) REFERENCES `user` (usr_id),
FOREIGN KEY (usr_followed) REFERENCES `user` (usr_id)
);
