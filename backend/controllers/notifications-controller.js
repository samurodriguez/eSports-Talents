'use strict';

const jwt = require('jsonwebtoken');
const notificationsRepository = require('../repositories/notifications-repository');

async function getUserNotifications(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    const notifications = await notificationsRepository.getUserNotifications(userId);

    res.send(notifications);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getUserNotifications };
