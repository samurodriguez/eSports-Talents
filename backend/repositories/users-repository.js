'use strict';

const database = require('../infrastructure/database');
const notificationsRepository = require('./notifications-repository');

async function getUserByEmail(email) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM `user` WHERE usr_email = ?';
  const [user] = await pool.query(query, email);

  return user[0];
}

async function getUserById(userId) {
  const pool = await database.getPool();
  const query =
    'SELECT u.usr_id, u.usr_role, u.usr_name, u.usr_lastname, u.usr_email, u.usr_nickname, u.usr_password, u.usr_birth, u.tel, u.province, u.usr_photo, u.usr_header, u.usr_bio, u.fav_team, u.usr_position, u.usr_rank, t.team_id, t.team_name FROM user u LEFT JOIN team t ON u.usr_team = t.team_id WHERE usr_id = ?';
  const [user] = await pool.query(query, userId);

  return user[0];
}

async function createUser(
  role,
  name,
  lastname,
  email,
  nickname,
  password,
  birth,
  tel,
  province,
  photo,
  bio,
  fav_team,
  team,
  position,
  rank
) {
  const pool = await database.getPool();

  const insertUser =
    'INSERT INTO `user` (usr_role, usr_name, usr_lastname, usr_email, usr_nickname, usr_password, usr_birth, tel, province, usr_photo, usr_bio, fav_team, usr_team, usr_position, usr_rank) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const [userCreated] = await pool.query(insertUser, [
    role,
    name,
    lastname,
    email,
    nickname,
    password,
    birth,
    tel,
    province,
    photo,
    bio,
    fav_team,
    team,
    position,
    rank,
  ]);

  return userCreated.insertId;
}

async function updateUserPhoto(photo, userId) {
  const pool = await database.getPool();
  const updateUser = 'UPDATE `user` SET usr_photo = ? WHERE usr_id = ?';
  await pool.query(updateUser, [photo, userId]);

  return true;
}

async function updateUserHeader(header, userId) {
  const pool = await database.getPool();
  const updateUser = 'UPDATE `user` SET usr_header = ? WHERE usr_id = ?';
  await pool.query(updateUser, [header, userId]);

  return true;
}

async function updateUser(
  name,
  lastname,
  email,
  nickname,
  password,
  birth,
  tel,
  province,
  bio,
  fav_team,
  team,
  position,
  rank,
  userId
) {
  const pool = await database.getPool();
  const updateUser =
    'UPDATE `user` SET usr_name = ?, usr_lastname = ?, usr_email = ?, usr_nickname = ?, usr_password = ?, usr_birth = ?, tel = ?, province = ?, usr_bio = ?, fav_team = ?, usr_team = ?, usr_position = ?, usr_rank = ? WHERE usr_id = ?';
  await pool.query(updateUser, [
    name,
    lastname,
    email,
    nickname,
    password,
    birth,
    tel,
    province,
    bio,
    fav_team,
    team,
    position,
    rank,
    userId,
  ]);

  return true;
}

async function follow(userFollowing, userFollowed) {
  const pool = await database.getPool();
  const insertFollow = 'INSERT INTO user_follows (usr_following, usr_followed) VALUES (?, ?)';
  await pool.query(insertFollow, [userFollowing, userFollowed]);
  const followId = `${userFollowing}${userFollowed}`;

  await notificationsRepository.notify(userFollowing, userFollowed, 'follow');

  return followId;
}

async function followCheck(userFollowing, userFollowed) {
  const pool = await database.getPool();
  const followCheckQuery =
    'SELECT COUNT(*) "followCheck" FROM user_follows WHERE usr_following = ? && usr_followed = ?';
  const [check] = await pool.query(followCheckQuery, [userFollowing, userFollowed]);

  return check[0];
}

async function unfollow(userUnfollowing, userUnfollowed) {
  const pool = await database.getPool();
  const deleteFollow = 'DELETE FROM user_follows WHERE usr_following = ? AND usr_followed = ?';
  const [deletedFollow] = await pool.query(deleteFollow, [userUnfollowing, userUnfollowed]);

  return deletedFollow.affectedRows;
}

async function getPlayersOfTeam(teamId) {
  const pool = await database.getPool();
  const query =
    'SELECT usr_id, usr_name, usr_lastname, usr_nickname, usr_photo, usr_position, usr_rank, province FROM `user` WHERE usr_team = ? ';
  const players = await pool.query(query, teamId);

  return players[0];
}

async function removePlayerOfTeam(userId) {
  const pool = await database.getPool();
  const removePlayer = 'UPDATE `user` SET usr_team = null WHERE usr_id = ?';
  await pool.query(removePlayer, userId);

  return true;
}

async function getFollowingUsers(userId) {
  const pool = await database.getPool();
  const query = 'SELECT usr_followed FROM user_follows WHERE usr_following = ?';
  const users = await pool.query(query, userId);
  const followingIds = users[0].map((usr) => usr.usr_followed);

  return followingIds;
}

async function like(userId, postId) {
  const pool = await database.getPool();
  const insertLike = 'INSERT INTO user_likes (usr_id, post_id) VALUES (?, ?)';
  await pool.query(insertLike, [userId, postId]);
  const likeId = `${userId}${postId}`;

  const repliedPost = await postsRepository.getPostById(postId);
  const userToNotify = repliedPost.usr_id;
  await notificationsRepository.notify(userId, userToNotify, 'postLike', null, postId);

  return likeId;
}

async function likeCheck(userId, postId) {
  const pool = await database.getPool();
  const likeCheckQuery = 'SELECT COUNT(*) "likeCheck" FROM user_likes WHERE usr_id = ? && post_id = ?';
  const [check] = await pool.query(likeCheckQuery, [userId, postId]);

  return check[0];
}

async function unlike(userId, postId) {
  const pool = await database.getPool();
  const deleteLike = 'DELETE FROM user_likes WHERE usr_id = ? AND post_id = ?';
  const [deletedLike] = await pool.query(deleteLike, [userId, postId]);

  return deletedLike.affectedRows;
}

async function share(userId, postId) {
  const pool = await database.getPool();
  const insertShare = 'INSERT INTO user_shares (usr_sharing, post_shared) VALUES (?, ?)';
  await pool.query(insertShare, [userId, postId]);
  const shareId = `${userId}${postId}`;

  return shareId;
}

async function shareCheck(userSharing, postShared) {
  const pool = await database.getPool();
  const shareCheckQuery = 'SELECT COUNT(*) "shareCheck" FROM user_shares WHERE usr_sharing = ? && post_shared = ?';
  const [check] = await pool.query(shareCheckQuery, [userSharing, postShared]);

  return check[0];
}

async function unshare(userId, postId) {
  const pool = await database.getPool();
  const deleteShare = 'DELETE FROM user_shares WHERE usr_sharing = ? AND post_shared = ?';
  const [deletedShare] = await pool.query(deleteShare, [userId, postId]);

  return deletedShare.affectedRows;
}

async function getUserFollowersCount(userId) {
  const pool = await database.getPool();

  const getFollowers = 'SELECT COUNT(*) "followers_count" FROM user_follows WHERE usr_followed = ?';
  const [followersCount] = await pool.query(getFollowers, userId);

  return followersCount[0];
}

async function getUserFollowingCount(userId) {
  const pool = await database.getPool();

  const getFollowing = 'SELECT COUNT(*) "following_count" FROM user_follows WHERE usr_following = ?';
  const [followingCount] = await pool.query(getFollowing, userId);

  return followingCount[0];
}

// Explore querys

async function getUsersByName(name) {
  const pool = await database.getPool();
  const nameQuery = `%${name}%`;
  const query = 'SELECT * FROM `user` WHERE usr_name LIKE ? OR usr_nickname LIKE ?';
  const [users] = await pool.query(query, [nameQuery, nameQuery]);

  return users;
}

async function getUsersByRole(role) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM `user` WHERE usr_role LIKE ?';
  const [users] = await pool.query(query, role);

  return users;
}

async function getUsersByPosition(position) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM `user` WHERE usr_position LIKE ?';
  const [users] = await pool.query(query, position);

  return users;
}

async function getUsersByProvince(province) {
  const pool = await database.getPool();
  const provinceQuery = `%${province}%`;
  const query = 'SELECT * FROM `user` WHERE province LIKE ?';
  const [users] = await pool.query(query, provinceQuery);

  return users;
}

async function getUsersByTeam(team) {
  const pool = await database.getPool();
  const teamQuery = `%${team}%`;
  const query = `SELECT * FROM user u INNER JOIN team t ON u.usr_team = t.team_id WHERE t.team_name LIKE ?`;
  const [users] = await pool.query(query, teamQuery);

  return users;
}

async function getUsersByAge(order) {
  const pool = await database.getPool();
  const query = `SELECT * FROM user WHERE usr_birth IS NOT NULL ORDER BY usr_birth ${order}`;
  const [users] = await pool.query(query);

  return users;
}

async function getUsersByRank(order) {
  const pool = await database.getPool();
  const query = `SELECT * FROM user WHERE usr_rank IS NOT NULL ORDER BY usr_rank ${order}`;
  const [users] = await pool.query(query);

  return users;
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUserPhoto,
  updateUserHeader,
  updateUser,
  follow,
  followCheck,
  unfollow,
  getPlayersOfTeam,
  removePlayerOfTeam,
  getFollowingUsers,
  like,
  likeCheck,
  unlike,
  share,
  shareCheck,
  unshare,
  getUserFollowersCount,
  getUserFollowingCount,
  getUsersByName,
  getUsersByRole,
  getUsersByPosition,
  getUsersByProvince,
  getUsersByTeam,
  getUsersByAge,
  getUsersByRank,
};

const postsRepository = require('./posts-repository');
