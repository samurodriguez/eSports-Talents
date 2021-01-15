'use strict';

const database = require('../infrastructure/database');

function formatDate(date) {
  const padNumber = (number) => `${number}`.padStart(2, '0');
  const s = padNumber(date.getSeconds());
  const m = padNumber(date.getMinutes());
  const h = padNumber(date.getHours());
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = padNumber(date.getDate());

  return `${YYYY}-${MM}-${DD} ${h}:${m}:${s}`;
}

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
    query = 'SELECT * FROM recruitment_request WHERE scout_id = ?';
  } else if (role === 'player') {
    query = 'SELECT * FROM recruitment_request WHERE player_id = ?';
  } else if (role === 'amateur') {
    throw new Error('Los usuarios amateur no pueden recibir ni enviar solicitudes');
  }

  const [requests] = await pool.query(query, userId);

  return requests;
}

module.exports = { createRequest, deleteRequest, getUserRequests, getRequestById };
