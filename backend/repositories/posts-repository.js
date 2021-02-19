'use strict';

const database = require('../infrastructure/database');
const { getFollowingUsers } = require('./users-repository');
const formatDate = require('../utils/formatDate');

async function createPost(userId, title, content) {
  const pool = await database.getPool();
  const postDate = formatDate(new Date());
  const insertPost = 'INSERT INTO post (usr_id, post_title, post_content, post_date) VALUES (?, ?, ?, ?)';
  const [createdPost] = await pool.query(insertPost, [userId, title, content, postDate]);

  return createdPost.insertId;
}

async function deletePost(postId, userId) {
  const pool = await database.getPool();

  const deleteNotifications = 'DELETE FROM user_notification WHERE post_id = ?';
  const deleteComments = 'DELETE FROM comment WHERE post_replied = ?';
  const deleteLikes = 'DELETE FROM user_likes WHERE post_id = ?';
  const deleteShares = 'DELETE FROM user_shares WHERE post_shared = ?';
  const deletePost = 'DELETE FROM post WHERE post_id = ? AND usr_id = ?';

  await pool.query(deleteNotifications, postId);
  await pool.query(deleteComments, postId);
  await pool.query(deleteLikes, postId);
  await pool.query(deleteShares, postId);
  const [deletedPost] = await pool.query(deletePost, [postId, userId]);

  return deletedPost.affectedRows;
}

async function getUserPosts(userId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM post WHERE usr_id = ? ORDER BY post_date DESC';
  const [posts] = await pool.query(query, userId);

  return posts;
}

async function getFollowingUsersPosts(userId) {
  const pool = await database.getPool();

  const followingIds = await getFollowingUsers(userId);

  const query = `SELECT p.post_id, p.usr_id, u.usr_photo, u.usr_name, u.usr_lastname, u.usr_nickname, u.usr_rank, u.usr_position, p.post_title, p.post_content, s.usr_sharing FROM post p LEFT JOIN user_shares s on p.post_id = s.post_shared INNER JOIN user u on u.usr_id = p.usr_id WHERE s.usr_sharing IN (${
    followingIds.toString() || null
  }) OR p.usr_id IN (${followingIds.toString() || null}) ORDER BY post_date DESC`;
  const [posts] = await pool.query(query);

  return posts;
}

async function getPostById(postId) {
  const pool = await database.getPool();
  const query =
    'SELECT p.post_id, u.usr_id, u.usr_photo, u.usr_name, u.usr_lastname, u.usr_nickname, u.usr_rank, u.usr_position, p.post_title, p.post_content FROM post p INNER JOIN user u ON p.usr_id = u.usr_id WHERE p.post_id = ?';
  const [post] = await pool.query(query, postId);

  return post[0];
}

module.exports = { createPost, deletePost, getUserPosts, getFollowingUsersPosts, getPostById };
