'use strict';

const database = require('../infrastructure/database');
const notificationsRepository = require('./notifications-repository');
const formatDate = require('../utils/formatDate');

async function getRequestById(scoutId, playerId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM recruitment_request WHERE scout_id = ? AND player_id = ?';
  const [request] = await pool.query(query, [scoutId, playerId]);

  return request[0];
}

async function createRequest(scoutId, playerId, title, content) {
  const pool = await database.getPool();
  const reqDate = formatDate(new Date());

  const insertRequest =
    'INSERT INTO recruitment_request (scout_id, player_id, req_date, req_title, req_content) VALUES (?, ?, ?, ?, ?)';
  const [createdRequest] = await pool.query(insertRequest, [scoutId, playerId, reqDate, title, content]);
  const requestId = {
    inserId: createdRequest.insertId,
    scoutId: scoutId,
    playerId: playerId,
  };

  await notificationsRepository.notify(scoutId, playerId, 'request');

  return requestId;
}

async function deleteRequest(scoutId, playerId) {
  const pool = await database.getPool();

  const deleteRequest = 'DELETE FROM recruitment_request WHERE scout_id = ? AND player_id = ?';
  const [deletedRequest] = await pool.query(deleteRequest, [scoutId, playerId]);

  return deletedRequest.affectedRows;
}

async function getUserRequests(userId, role) {
  const pool = await database.getPool();

  let query = '';
  if (role === 'scout') {
    query =
      'SELECT r.scout_id, r.player_id, u.usr_photo, u.usr_name, u.usr_lastname, r.req_title, r.req_content, r.req_status, r.req_date FROM recruitment_request r INNER JOIN user u ON r.player_id = u.usr_id WHERE scout_id = ?';
  } else if (role === 'player') {
    query =
      'SELECT r.scout_id, r.player_id, u.usr_photo, u.usr_name, u.usr_lastname, r.req_title, r.req_content, r.req_status, r.req_date FROM recruitment_request r INNER JOIN user u ON r.scout_id = u.usr_id WHERE player_id = ?';
  } else if (role === 'amateur') {
    throw new Error('Los usuarios amateur no pueden recibir ni enviar solicitudes');
  }

  const [requests] = await pool.query(query, userId);

  return requests;
}

async function acceptRequest(scoutId, playerId) {
  const pool = await database.getPool();

  const acceptRequest = 'UPDATE recruitment_request SET req_status = true WHERE scout_id = ? AND player_id = ?';
  const [acceptedRequest] = await pool.query(acceptRequest, [scoutId, playerId]);

  return acceptedRequest;
}

async function rejectRequest(scoutId, playerId) {
  const pool = await database.getPool();

  const rejectRequest = 'UPDATE recruitment_request SET req_status = false WHERE scout_id = ? AND player_id = ?';
  const [rejectedRequest] = await pool.query(rejectRequest, [scoutId, playerId]);

  return rejectedRequest;
}

module.exports = { createRequest, deleteRequest, getUserRequests, getRequestById, acceptRequest, rejectRequest };
