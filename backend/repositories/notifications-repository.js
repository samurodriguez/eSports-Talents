'use strict';

const database = require('../infrastructure/database');
const formatDate = require('../utils/formatDate');

async function notify(userActing, userToNotify, activityType, commentId, postId) {
  const pool = await database.getPool();
  const notiDate = formatDate(new Date());
  const notifyQuery =
    'INSERT INTO user_notification (usr_acting, usr_to_notify, activity_type, cmnt_id, post_id, noti_date) VALUES (?, ?, ?, ?, ?, ?)';

  const notification = await pool.query(notifyQuery, [
    userActing,
    userToNotify,
    activityType,
    commentId,
    postId,
    notiDate,
  ]);

  return notification.insertId;
}

async function getUserNotifications(userId) {
  const pool = await database.getPool();

  const query = 'SELECT * FROM user_notification WHERE usr_to_notify = ?';
  const [notifications] = await pool.query(query, userId);

  return notifications;
}

async function deleteNotificationByCommentId(commentId) {
  const pool = await database.getPool();

  const query = 'DELETE FROM user_notification WHERE cmnt_id = ?';
  const [deletedNotification] = await pool.query(query, commentId);

  return deletedNotification.affectedRows;
}

module.exports = { notify, getUserNotifications, deleteNotificationByCommentId };
