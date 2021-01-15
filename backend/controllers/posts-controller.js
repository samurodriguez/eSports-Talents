'use strict';

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { postsRepository, usersRepository, commentsRepository } = require('../repositories');

async function post(req, res) {
  try {
    const postSchema = Joi.object({
      title: Joi.string().max(255).required(),
      content: Joi.string().max(500).required(),
    });

    await postSchema.validateAsync(req.body);

    const { title, content } = req.body;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    const postId = await postsRepository.createPost(userId, title, content);

    return res.send({ postId: postId });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getFollowingUsersPosts(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    const posts = await postsRepository.getFollowingUsersPosts(userId);

    return res.send(posts);
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

async function getPost(req, res) {
  try {
    const postId = req.params.postId;

    const schema = Joi.number().positive();

    await schema.validateAsync(postId);

    const post = await postsRepository.getPostById(postId);
    const comments = await commentsRepository.getCommentsByPostId(postId);

    if (!post) {
      throw new Error('El post no existe');
    }

    const postWithComments = {
      post: post,
      comments: comments,
    };

    res.send(postWithComments);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = { post, getFollowingUsersPosts, getPost };
