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

async function getUserPosts(userId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM post WHERE usr_id = ? ORDER BY post_date DESC';
  const [posts] = await pool.query(query, userId);

  return posts;
}

async function getFollowingUsersPosts(userId) {
  const pool = await database.getPool();

  const followingIds = await getFollowingUsers(userId);

  const query = `SELECT * FROM post p INNER JOIN user u ON u.usr_id = p.usr_id LEFT JOIN user_shares s ON p.post_id = s.post_id WHERE p.usr_id IN (${followingIds.toString()}) OR s.usr_id IN (${followingIds.toString()}) ORDER BY post_date DESC`;
  const [posts] = await pool.query(query);

  return posts;
}

async function getPostById(postId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM post p INNER JOIN user u ON p.usr_id = u.usr_id WHERE p.post_id = ?';
  const [post] = await pool.query(query, postId);

  return post[0];
}

module.exports = { createPost, getUserPosts, getFollowingUsersPosts, getPostById };
