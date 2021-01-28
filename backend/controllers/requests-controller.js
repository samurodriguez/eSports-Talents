'use strict';

const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const { requestsRepository, usersRepository } = require('../repositories');

async function getRequest(req, res) {
  try {
    const scoutId = req.params.scoutId;
    const playerId = req.params.playerId;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    if (userId !== +scoutId && userId !== +playerId) {
      const error = new Error('No estás autorizado para ver esta solicitud');
      error.code = 401;
      throw error;
    }

    const request = await requestsRepository.getRequestById(scoutId, playerId);
    if (!request) {
      throw new Error('La solicitud no existe');
    }

    res.send(request);
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

async function sendRequest(req, res) {
  try {
    const registerSchema = Joi.object({
      title: Joi.string().max(255).required(),
      content: Joi.string().max(500).required(),
    });

    await registerSchema.validateAsync(req.body);

    const { title, content } = req.body;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId: scoutId } = decodedToken;
    const playerId = req.params.userId;

    const player = await usersRepository.getUserById(playerId);
    const scout = await usersRepository.getUserById(scoutId);

    if (scout.usr_role !== 'scout') {
      const error = new Error('Usuario no autorizado para realizar una solicitud');
      error.code = 401;
      throw error;
    }

    const requestId = await requestsRepository.createRequest(scoutId, playerId, title, content);

    const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
    const data = {
      from: 'eSports Talents <esportstalents@outlook.com>',
      to: `${player.usr_email}`,
      subject: `¡Nueva solicitud de reclutamiento!`,
      text: `¡Hola ${player.usr_name}!\nTienes una nueva solicitud de reclutamiento de ${scout.usr_name}, puedes consultarla desde http://localhost:8080/requests/${scoutId}/${playerId} o aceptarla desde http://localhost:8080/requests/${scoutId}/${playerId}/accept`,
    };
    await mg.messages().send(data);

    return res.send(requestId);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function deleteRequest(req, res) {
  try {
    const scoutId = req.params.scoutId;
    const playerId = req.params.playerId;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    if (userId !== +scoutId && userId !== +playerId) {
      const error = new Error('No estás autorizado para eliminar esta solicitud');
      error.code = 401;
      throw error;
    }

    const deletedRequest = await requestsRepository.deleteRequest(scoutId, playerId);
    if (deletedRequest === 0) {
      throw new Error('La solicitud no existe');
    }

    res.send({ message: 'Solicitud eliminada correctamente' });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

async function getUserRequests(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, userRole } = decodedToken;

    const userRequests = await requestsRepository.getUserRequests(userId, userRole);

    res.send(userRequests);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err.message);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function acceptRequest(req, res) {
  try {
    const scoutId = req.params.scoutId;
    const playerId = req.params.playerId;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    if (userId !== +playerId) {
      const error = new Error('No estás autorizado para aceptar esta solicitud');
      error.code = 401;
      throw error;
    }

    const acceptedRequest = await requestsRepository.acceptRequest(scoutId, playerId);
    if (acceptedRequest.affectedRows === 0) {
      throw new Error('La solicitud no existe');
    } else if (acceptedRequest.info.search('Changed: 0') !== -1) {
      throw new Error('La solicitud ya estaba aceptada');
    }

    res.send({ message: 'Solicitud aceptada correctamente' });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

async function rejectRequest(req, res) {
  try {
    const scoutId = req.params.scoutId;
    const playerId = req.params.playerId;

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;

    if (userId !== +playerId) {
      const error = new Error('No estás autorizado para aceptar esta solicitud');
      error.code = 401;
      throw error;
    }

    const rejectedRequest = await requestsRepository.rejectRequest(scoutId, playerId);
    if (rejectedRequest.affectedRows === 0) {
      throw new Error('La solicitud no existe');
    } else if (rejectedRequest.info.search('Changed: 0') !== -1) {
      throw new Error('La solicitud ya estaba rechazada');
    }

    res.send({ message: 'Solicitud rechazada correctamente' });
  } catch (err) {
    console.log(err);
    res.send({ error: err.message });
  }
}

module.exports = { getRequest, sendRequest, deleteRequest, getUserRequests, acceptRequest, rejectRequest };
