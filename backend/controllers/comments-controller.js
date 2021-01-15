'use strict';

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { commentsRepository } = require('../repositories');

async function createComment(req, res) {
  try {
    const { content } = req.body;
    const commentSchema = Joi.string().max(255).required();
    await commentSchema.validateAsync(content);

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const postId = req.params.postId;

    const commentId = await commentsRepository.createComment(userId, content, postId);

    return res.send({ commentId: commentId });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function deleteComment(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const commentId = req.params.commentId;

    const affectedRows = await commentsRepository.deleteComment(userId, commentId);

    if (affectedRows === 0) {
      throw new Error('El comentario no existe');
    }

    res.send({ message: 'Comentario eliminado con éxito' });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
}

module.exports = { createComment, deleteComment };
