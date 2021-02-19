'use strict';

// Modules
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

// Controllers
const {
  teamsController,
  usersController,
  postsController,
  requestsController,
  commentsController,
  notificationsController,
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
app.use(cors());
app.use(bodyParser.json());
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(express.static('uploads'));

// Signup
app.post('/signup', usersController.register);
app.post('/teamSignup', teamsController.registerTeam);

// Login
app.get('/login', async (req, res) => {
  res.send('Esta sería la página de login');
});
app.post('/login', usersController.login);

// Users
app.get('/home', validateAuth, postsController.getFollowingUsersPosts);
app.get('/explore', usersController.explore);
app.post('/upload-photos', validateAuth, usersController.uploadAvatar);
app.post('/upload-header', validateAuth, usersController.uploadHeader);
app.get('/user/:userId', usersController.getProfile);
app.put('/user/:userId/update', validateAuth, usersController.update);
app.post('/user/:userId/follow', validateAuth, usersController.followUser);
app.get('/user/:userId/follow_check', validateAuth, usersController.checkUserFollow);
app.delete('/user/:userId/unfollow', validateAuth, usersController.unfollowUser);

// Teams
app.get('/team/:teamId', teamsController.getTeamProfile);
app.get('/teams', teamsController.getListOfTeams);
app.put('/team/:teamId/update', validateAuth, teamsController.updateTeamProfile);

// Posts
app.get('/post/:postId', postsController.getPost);
app.delete('/post/:postId/delete', postsController.deletePost);
app.post('/home', validateAuth, postsController.post);
app.post('/post/:postId/like', validateAuth, usersController.userLikesPost);
app.get('/post/:postId/like_check', validateAuth, usersController.checkUserLike);
app.delete('/post/:postId/unlike', validateAuth, usersController.userUnlikesPost);
app.post('/post/:postId/share', validateAuth, usersController.userSharesPost);
app.get('/post/:postId/share_check', validateAuth, usersController.checkUserShare);
app.delete('/post/:postId/unshare', validateAuth, usersController.userUnsharesPost);

// Comments
app.post('/post/:postId/comment', validateAuth, commentsController.createComment);
app.delete('/post/:postId/comment/:commentId/delete', validateAuth, commentsController.deleteComment);

// Requests
app.get('/requests', validateAuth, requestsController.getUserRequests);
app.get('/requests/:scoutId/:playerId', validateAuth, requestsController.getRequest);
app.post('/user/:userId/request', validateAuth, requestsController.sendRequest);
app.put('/requests/:scoutId/:playerId/accept', validateAuth, requestsController.acceptRequest);
app.put('/requests/:scoutId/:playerId/reject', validateAuth, requestsController.rejectRequest);
app.delete('/requests/:scoutId/:playerId/delete', validateAuth, requestsController.deleteRequest);

// Notifications
app.get('/notifications', validateAuth, notificationsController.getUserNotifications);

// Not found
app.get('*', notFound);

// Server listener
app.listen(port, () => console.log(`Escuchando ${port}`));
