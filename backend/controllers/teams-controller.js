'use strict';

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// const sengrid = require('@sendgrid/mail');
const { teamsRepository, usersRepository } = require('../repositories');

async function registerTeam(req, res) {
  try {
    const registerSchema = Joi.object({
      name: Joi.string().max(40).required(),
      email: Joi.string().email().max(100).required(),
      password: Joi.string().min(4).max(20).required(),
      repeatPassword: Joi.ref('password'),
      foundationDate: Joi.string().max(20).allow(null, ''),
      logo: Joi.string().max(255).allow(null, ''),
      province: Joi.string().max(40).allow(null, ''),
      tel: Joi.string().max(9).allow(null, ''),
      bio: Joi.string().max(500).allow(null, ''),
    });

    await registerSchema.validateAsync(req.body);

    const { name, email, password, foundationDate, logo, province, tel, bio } = req.body;

    const team = await teamsRepository.getTeamByEmail(email);

    if (team) {
      const error = new Error('Ya existe un equipo con ese email');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const teamId = await teamsRepository.createTeam(
      name,
      email,
      passwordHash,
      foundationDate,
      logo,
      province,
      tel,
      bio
    );
    return res.send({ teamId: teamId });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getTeamProfile(req, res) {
  try {
    const teamId = req.params.teamId;

    const schema = Joi.number().positive();

    await schema.validateAsync(teamId);

    const team = await teamsRepository.getTeamById(teamId);
    const teamPlayers = await usersRepository.getPlayersOfTeam(teamId);

    if (!team) {
      throw new Error('El equipo no existe');
    }

    res.send({ teamInfo: team, teamPlayers: teamPlayers });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function updateTeamProfile(req, res) {
  try {
    const updateSchema = Joi.object({
      name: Joi.string().max(40).allow(null, ''),
      email: Joi.string().email().max(100).allow(null, ''),
      password: Joi.string().min(4).max(20).allow(null, ''),
      repeatPassword: Joi.ref('password'),
      foundationDate: Joi.string().max(20).allow(null, ''),
      logo: Joi.string().max(255).allow(null, ''),
      province: Joi.string().max(40).allow(null, ''),
      tel: Joi.string().max(9).allow(null, ''),
      bio: Joi.string().max(500).allow(null, ''),
      playerToRemove: Joi.string().allow(null, ''),
    });

    await updateSchema.validateAsync(req.body);

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const tokenId = decodedToken.teamId;
    const teamId = req.params.teamId;

    if (tokenId.toString() !== teamId) {
      const error = new Error('No estás autorizado para actualizar este perfil');
      error.status = 409;
      throw error;
    }

    const { name, email, password, foundationDate, logo, province, tel, bio, playerToRemove } = req.body;

    const team = await teamsRepository.getTeamById(teamId);

    if (!team) {
      const error = new Error('No existe ningún equipo con ese ID');
      error.status = 409;
      throw error;
    }

    let passwordHash = null;

    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    await teamsRepository.updateTeam(
      name || team.team_name,
      email || team.team_email,
      passwordHash || team.team_password,
      foundationDate || team.foundation_date,
      logo || team.team_logo,
      province || team.province,
      tel || team.tel,
      bio || team.team_bio,
      teamId
    );

    if (playerToRemove) {
      await usersRepository.removePlayerOfTeam(playerToRemove);
    }

    return res.send({ teamUpdated: teamId });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    } else if (err.message === 'jwt must be provided') {
      err.message = 'Porfavor, haz login para actualizar el perfil';
      err.status = 409;
    }
    res.status(err.status || 500);
    console.log(err);
    res.send({ error: err.message });
  }
}

async function getListOfTeams(req, res) {
  try {
    const teams = await teamsRepository.getListOfTeams();
    res.send(teams);
  } catch (err) {
    res.status(err.status || 500);
    console.log(err);
    res.send({ error: err.message });
  }
}

module.exports = { registerTeam, getTeamProfile, updateTeamProfile, getListOfTeams };
