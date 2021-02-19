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

async function getListOfTeams() {
  const pool = await database.getPool();
  const query = 'SELECT team_id, team_name FROM team';
  const [teams] = await pool.query(query);

  return teams;
}

async function createTeam(name, email, password, foundationDate, logo, province, tel, bio) {
  const pool = await database.getPool();
  const insertTeam =
    'INSERT INTO team (team_name, team_email, team_password, foundation_date, team_logo, province, tel, team_bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  const [teamCreated] = await pool.query(insertTeam, [name, email, password, foundationDate, logo, province, tel, bio]);

  return teamCreated.insertId;
}

async function updateTeamLogo(photo, teamId) {
  const pool = await database.getPool();
  const updateUser = 'UPDATE team SET team_logo = ? WHERE team_id = ?';
  await pool.query(updateUser, [photo, teamId]);

  return true;
}

async function updateTeamHeader(header, teamId) {
  const pool = await database.getPool();
  const updateUser = 'UPDATE team SET team_header = ? WHERE team_id = ?';
  await pool.query(updateUser, [header, teamId]);

  return true;
}

async function updateTeam(name, email, password, foundationDate, logo, province, tel, bio, teamId) {
  const pool = await database.getPool();
  const updateTeam =
    'UPDATE team SET team_name = ?, team_email = ?, team_password = ?, foundation_date = ?, team_logo = ?, province = ?, tel = ?, team_bio = ? WHERE team_id = ?';
  await pool.query(updateTeam, [name, email, password, foundationDate, logo, province, tel, bio, teamId]);

  return true;
}

module.exports = {
  getTeamByEmail,
  getTeamById,
  getListOfTeams,
  createTeam,
  updateTeamLogo,
  updateTeamHeader,
  updateTeam,
};
