'use strict';

const database = require('../infrastructure/database');

async function createComment(userId, content, postId) {
  const pool = await database.getPool();
  const insertComment = 'INSERT INTO `comment`(usr_id, cmnt_content, post_replied) VALUES (?, ?, ?)';
  const [createdComment] = await pool.query(insertComment, [userId, content, postId]);

  return createdComment.insertId;
}

async function deleteComment(userId, commentId) {
  const pool = await database.getPool();
  const deleteComment = 'DELETE FROM `comment` WHERE usr_id = ? AND cmnt_id = ?';
  const [deletedComment] = await pool.query(deleteComment, [userId, commentId]);

  return deletedComment.affectedRows;
}

async function getCommentsByPostId(postId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM `comment` WHERE post_replied = ?';
  const [comments] = await pool.query(query, postId);

  return comments;
}

module.exports = { createComment, deleteComment, getCommentsByPostId };
