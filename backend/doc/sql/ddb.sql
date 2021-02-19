CREATE SCHEMA esports_talents;

USE esports_talents;

CREATE TABLE team (
team_id INT NOT NULL AUTO_INCREMENT,
team_name VARCHAR(50) NOT NULL,
team_email VARCHAR(100) NOT NULL,
team_password VARCHAR(255) NOT NULL,
foundation_date DATE,
team_logo VARCHAR(255),
team_header VARCHAR(255),
team_bio VARCHAR(500),
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
usr_header VARCHAR(255),
usr_bio VARCHAR(500),
fav_team VARCHAR(40),
usr_team INT,
usr_position ENUM('top', 'jungle', 'mid', 'adc', 'support'),
usr_rank TINYINT,
PRIMARY KEY (usr_id),
FOREIGN KEY (usr_team) REFERENCES team (team_id),
CHECK (usr_rank BETWEEN 0 AND 26)
);


CREATE TABLE post (
post_id INT NOT NULL AUTO_INCREMENT,
usr_id INT NOT NULL,
post_title VARCHAR(255) NOT NULL,
post_content VARCHAR(500) NOT NULL,
post_date DATETIME NOT NULL,
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

CREATE TABLE `comment` (
cmnt_id INT NOT NULL AUTO_INCREMENT,
usr_id INT NOT NULL,
cmnt_content VARCHAR(255),
post_replied INT NOT NULL,
PRIMARY KEY (cmnt_id),
FOREIGN KEY (usr_id) REFERENCES `user` (usr_id),
FOREIGN KEY (post_replied) REFERENCES post (post_id)
);

CREATE TABLE user_shares (
usr_sharing INT NOT NULL,
post_shared INT NOT NULL,
PRIMARY KEY (usr_sharing, post_shared),
FOREIGN KEY (usr_sharing) REFERENCES `user` (usr_id),
FOREIGN KEY (post_shared) REFERENCES post (post_id)
);

CREATE TABLE recruitment_request (
scout_id INT NOT NULL,
player_id INT NOT NULL,
req_date DATETIME NOT NULL,
req_title VARCHAR(255),
req_content VARCHAR(500) NOT NULL,
req_status BOOLEAN,
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

CREATE TABLE user_notification (
noti_id INT NOT NULL AUTO_INCREMENT,
usr_acting INT NOT NULL,
usr_to_notify INT NOT NULL,
activity_type ENUM("follow", "postLike", "postComment", "request") NOT NULL,
cmnt_id INT,
post_id INT,
noti_date DATETIME NOT NULL,
PRIMARY KEY (noti_id),
FOREIGN KEY (usr_acting) REFERENCES `user` (usr_id),
FOREIGN KEY (usr_to_notify) REFERENCES `user` (usr_id),
FOREIGN KEY (cmnt_id) REFERENCES `comment` (cmnt_id),
FOREIGN KEY (post_id) REFERENCES post (post_id)
);
