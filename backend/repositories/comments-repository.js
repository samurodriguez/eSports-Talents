'use strict';

const database = require('../infrastructure/database');
const notificationsRepository = require('./notifications-repository');
const postsRepository = require('./posts-repository');

async function createComment(userId, content, postId) {
  const pool = await database.getPool();

  const insertComment = 'INSERT INTO `comment`(usr_id, cmnt_content, post_replied) VALUES (?, ?, ?)';
  const [createdComment] = await pool.query(insertComment, [userId, content, postId]);
  const commentId = createdComment.insertId;
  const repliedPost = await postsRepository.getPostById(postId);
  const userToNotify = repliedPost.usr_id;
  await notificationsRepository.notify(userId, userToNotify, 'postComment', commentId, postId);

  return commentId;
}

async function deleteComment(userId, commentId) {
  const pool = await database.getPool();

  const deleteComment = 'DELETE FROM `comment` WHERE usr_id = ? AND cmnt_id = ?';
  const [deletedComment] = await pool.query(deleteComment, [userId, commentId]);

  return deletedComment.affectedRows;
}

async function getCommentsByPostId(postId) {
  const pool = await database.getPool();
  const query =
    'SELECT c.cmnt_id, c.post_replied, u.usr_id, u.usr_photo, u.usr_name, u.usr_lastname, u.usr_nickname, u.usr_rank, u.usr_position, c.cmnt_content FROM comment c INNER JOIN user u ON c.usr_id = u.usr_id WHERE post_replied = ?';
  const [comments] = await pool.query(query, postId);

  return comments;
}

module.exports = { createComment, deleteComment, getCommentsByPostId };
