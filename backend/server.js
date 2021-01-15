'use strict';

// Modules
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Controllers
const {
  teamsController,
  usersController,
  postsController,
  requestsController,
  commentsController,
} = require('./controllers');
const { validateAuth, notFound } = require('./middlewares');

// Variables
const port = process.env.SERVER_PORT;

// Declaration
const app = express();

// Logger
const accessLogStream = fs.createWriteStream('./access.txt', { flags: 'a' });

// Middlewares
app.use(morgan('combined', { immediate: true, stream: accessLogStream }));
app.use(bodyParser.json());

// Signup
app.post('/signup', usersController.register);
app.post('/teamSignup', teamsController.registerTeam);

// Login
app.post('/login', usersController.login);

// Users
app.get('/home', validateAuth, postsController.getFollowingUsersPosts);
//! app.get('/explore/', usersController.explore);  Aún no está acabada
app.get('/user/:userId', usersController.getProfile);
app.put('/user/:userId/update', validateAuth, usersController.update);
app.post('/user/:userId/follow', validateAuth, usersController.followUser);
app.delete('/user/:userId/unfollow', validateAuth, usersController.unfollowUser);

// Teams
app.get('/team/:teamId', teamsController.getTeamProfile);
app.put('/team/:teamId/update', validateAuth, teamsController.updateTeamProfile);

// Posts
app.get('/post/:postId', postsController.getPost);
app.post('/home', validateAuth, postsController.post);
app.post('/post/:postId/like', validateAuth, usersController.userLikesPost);
app.delete('/post/:postId/unlike', validateAuth, usersController.userUnlikesPost);
app.post('/post/:postId/share', validateAuth, usersController.userSharesPost);
app.delete('/post/:postId/unshare', validateAuth, usersController.userUnsharesPost);

// Comments
app.post('/post/:postId/comment', validateAuth, commentsController.createComment);
app.delete('/post/:postId/comment/:commentId/delete', validateAuth, commentsController.deleteComment);

// Requests
app.get('/requests', validateAuth, requestsController.getUserRequests);
app.get('/requests/:scoutId/:playerId', validateAuth, requestsController.getRequest);
app.post('/user/:userId/request', validateAuth, requestsController.sendRequest);
app.delete('/requests/:scoutId/:playerId/delete', validateAuth, requestsController.deleteRequest);

// Not found
app.get('*', notFound);

// Server listener
app.listen(port, () => console.log(`Escuchando ${port}`));
