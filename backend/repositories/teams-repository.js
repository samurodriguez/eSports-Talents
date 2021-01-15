'use strict';

const database = require('../infrastructure/database');

async function getTeamByEmail(email) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM team WHERE team_email = ?';
  const [team] = await pool.query(query, email);

  return team[0];
}

async function getTeamById(teamId) {
  const pool = await database.getPool();
  const query = 'SELECT * FROM team WHERE team_id = ?';
  const [team] = await pool.query(query, teamId);

  return team[0];
}

async function createTeam(name, email, password, foundationDate, logo, province, tel) {
  const pool = await database.getPool();
  const insertTeam =
    'INSERT INTO team (team_name, team_email, team_password, foundation_date, team_logo, province, tel) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const [teamCreated] = await pool.query(insertTeam, [name, email, password, foundationDate, logo, province, tel]);

  return teamCreated.insertId;
}

async function updateTeam(name, email, password, foundationDate, logo, province, tel, teamId) {
  const pool = await database.getPool();
  const updateTeam =
    'UPDATE team SET team_name = ?, team_email = ?, team_password = ?, foundation_date = ?, team_logo = ?, province = ?, tel = ? WHERE team_id = ?';
  await pool.query(updateTeam, [name, email, password, foundationDate, logo, province, tel, teamId]);

  return true;
}

module.exports = { getTeamByEmail, getTeamById, createTeam, updateTeam };
