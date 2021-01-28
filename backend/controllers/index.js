'use strict';

const teamsController = require('./teams-controller');
const usersController = require('./users-controller');
const postsController = require('./posts-controller');
const commentsController = require('./comments-controller');
const requestsController = require('./requests-controller');
const notificationsController = require('./notifications-controller');

module.exports = {
  teamsController,
  usersController,
  postsController,
  commentsController,
  requestsController,
  notificationsController,
};
