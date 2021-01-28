'use strict';

const usersRepository = require('./users-repository');
const teamsRepository = require('./teams-repository');
const postsRepository = require('./posts-repository');
const commentsRepository = require('./comments-repository');
const requestsRepository = require('./requests-repository');
const notificationsRepository = require('./notifications-repository');

module.exports = {
  usersRepository,
  teamsRepository,
  postsRepository,
  commentsRepository,
  requestsRepository,
  notificationsRepository,
};
