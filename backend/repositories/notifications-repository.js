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

  const query =
    'SELECT u.usr_name, u.usr_lastname, u.usr_photo, n.noti_id, n.activity_type, n.cmnt_id, n.post_id, n.noti_date, p.post_content, c.cmnt_content FROM user_notification n INNER JOIN user u ON u.usr_id = n.usr_acting LEFT JOIN post p ON n.post_id = p.post_id LEFT JOIN comment c ON n.cmnt_id = c.cmnt_id WHERE usr_to_notify = ? ORDER BY noti_date DESC';
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
