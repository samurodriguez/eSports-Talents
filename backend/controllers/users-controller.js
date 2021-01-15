'use strict';

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
// const sengrid = require('@sendgrid/mail');
const { usersRepository, teamsRepository, postsRepository } = require('../repositories');

async function register(req, res) {
  try {
    const registerSchema = Joi.object({
      role: Joi.string().valid('amateur', 'player', 'scout').required(),
      name: Joi.string().max(40).required(),
      lastname: Joi.string().max(100).allow(null, ''),
      email: Joi.string().email().max(100).required(),
      nickname: Joi.string().max(40).required(),
      password: Joi.string().min(4).max(20).required(),
      repeatPassword: Joi.ref('password'),
      birth: Joi.string().max(20).allow(null, ''),
      tel: Joi.string().max(9).allow(null, ''),
      province: Joi.string().max(40).allow(null, ''),
      photo: Joi.string().max(255).allow(null, ''),
      bio: Joi.string().max(500).allow(null, ''),
      fav_team: Joi.string().max(40).allow(null, ''),
      team: Joi.string().max(40).allow(null, ''),
      position: Joi.string().valid('top', 'jungle', 'mid', 'adc', 'support').allow(null, ''),
      rank: Joi.string().max(20).allow(null, ''),
    });

    await registerSchema.validateAsync(req.body);

    const {
      role,
      name,
      lastname,
      email,
      nickname,
      password,
      birth,
      tel,
      province,
      photo,
      bio,
      fav_team,
      team,
      position,
      rank,
    } = req.body;

    const user = await usersRepository.getUserByEmail(email);

    if (user) {
      const error = new Error('Ya existe un usuario con ese email');
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = await usersRepository.createUser(
      role,
      name,
      lastname,
      email,
      nickname,
      passwordHash,
      birth,
      tel,
      province,
      photo,
      bio,
      fav_team,
      team,
      position,
      rank
    );

    return res.send({ userId: userId });
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function update(req, res) {
  try {
    const updateSchema = Joi.object({
      name: Joi.string().max(40).allow(null),
      lastname: Joi.string().max(100).allow(null),
      email: Joi.string().email().max(100).allow(null),
      nickname: Joi.string().max(40).allow(null),
      password: Joi.string().min(4).max(20).allow(null),
      repeatPassword: Joi.ref('password'),
      birth: Joi.string().max(20).allow(null),
      tel: Joi.string().max(9).allow(null),
      province: Joi.string().max(40).allow(null),
      photo: Joi.string().max(255).allow(null),
      bio: Joi.string().max(500).allow(null),
      fav_team: Joi.string().max(40).allow(null),
      team: Joi.string().max(40).allow(null),
      position: Joi.string().valid('top', 'jungle', 'mid', 'adc', 'support').allow(null),
      rank: Joi.string().max(20).allow(null),
    });

    await updateSchema.validateAsync(req.body);

    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const tokenId = decodedToken.userId;
    const userId = req.params.userId;

    if (tokenId.toString() !== userId) {
      const error = new Error('No estás autorizado para actualizar este perfil');
      error.status = 409;
      throw error;
    }

    const {
      name,
      lastname,
      email,
      nickname,
      password,
      birth,
      tel,
      province,
      photo,
      bio,
      fav_team,
      team,
      position,
      rank,
    } = req.body;

    const user = await usersRepository.getUserById(userId);

    if (!user) {
      const error = new Error('No existe ningún usuario con ese ID');
      error.status = 409;
      throw error;
    }

    let passwordHash = null;

    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    await usersRepository.updateUser(
      name || user.usr_name,
      lastname || user.usr_lastname,
      email || user.usr_email,
      nickname || user.usr_nickname,
      passwordHash || user.usr_password,
      birth || user.usr_birth,
      tel || user.tel,
      province || user.province,
      photo || user.usr_photo,
      bio || user.usr_bio,
      fav_team || user.fav_team,
      team || user.usr_team,
      position || user.usr_position,
      rank || user.usr_rank,
      userId
    );

    return res.send({ userId: userId });
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

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(4).max(20).required(),
    });

    await schema.validateAsync({ email, password });

    const user = await usersRepository.getUserByEmail(email);

    if (!user) {
      const team = await teamsRepository.getTeamByEmail(email);

      if (!team) {
        const error = new Error('No existe ningún usuario con ese email');
        error.code = 404;
        throw error;
      }

      const isPasswordOk = await bcrypt.compare(password, team.team_password);

      if (!isPasswordOk) {
        const error = new Error('La contraseña es incorrecta');
        error.code = 401;
        throw error;
      }

      const tokenPayload = { teamId: team.team_id, teamName: team.team_name, teamEmail: team.team_email };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.send(token);
      return true;
    }
    const isPasswordOk = await bcrypt.compare(password, user.usr_password);

    if (!isPasswordOk) {
      const error = new Error('La contraseña es incorrecta');
      error.code = 401;
      throw error;
    }

    const tokenPayload = {
      userId: user.usr_id,
      userName: user.usr_name,
      userEmail: user.usr_email,
      userRole: user.usr_role,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.send(token);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.params.userId;

    const schema = Joi.number().positive();

    await schema.validateAsync(userId);

    const user = await usersRepository.getUserById(userId);
    if (!user) {
      throw new Error('El usuario no existe');
    }

    const userPosts = await postsRepository.getUserPosts(userId);

    const profile = {
      userInfo: user,
      userPosts: userPosts,
    };

    res.send(profile);
  } catch (err) {
    if (err.name === 'ValidationError') {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function followUser(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userFollowing = decodedToken.userId;
    const userFollowed = req.params.userId;
    const followId = await usersRepository.follow(userFollowing, userFollowed);

    res.send({ followId: followId });
  } catch (err) {
    if (err.errno === 1062) {
      err.message = 'Ya sigues a este usuario';
    }
    console.log(err);
    res.send({ Error: err.message });
  }
}

async function unfollowUser(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userUnfollowing = decodedToken.userId;
    const userUnfollowed = req.params.userId;
    const affectedRows = await usersRepository.unfollow(userUnfollowing, userUnfollowed);

    if (affectedRows === 0) {
      throw new Error('No sigues a este usuario');
    }

    res.send({ message: 'Has dejado de seguir al usuario' });
  } catch (err) {
    console.log(err);
    res.send({ Error: err.message });
  }
}

async function userLikesPost(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const postId = req.params.postId;

    const likeId = await usersRepository.like(userId, postId);

    res.send({ likeId: likeId });
  } catch (err) {
    if (err.errno === 1062) {
      err.message = 'Ya te gusta este post';
    }
    console.log(err);
    res.send({ Error: err.message });
  }
}

async function userUnlikesPost(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const postId = req.params.postId;

    const affectedRows = await usersRepository.unlike(userId, postId);

    if (affectedRows === 0) {
      throw new Error('El post ya no te gustaba');
    }

    res.send({ message: 'Ya no te gusta el post' });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
}

async function userSharesPost(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const postId = req.params.postId;

    const shareId = await usersRepository.share(userId, postId);

    res.send({ shareId: shareId });
  } catch (err) {
    if (err.errno === 1062) {
      err.message = 'Ya compartes este post';
    } else if (err.errno === 1452) {
      err.message = 'El post no existe';
    }
    console.log(err);
    res.send(err.message);
  }
}

async function userUnsharesPost(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decodedToken;
    const postId = req.params.postId;

    const affectedRows = await usersRepository.unshare(userId, postId);

    if (affectedRows === 0) {
      throw new Error('Ya no compartías el post');
    }

    res.send({ message: 'Ya no compartes post' });
  } catch (err) {
    console.log(err);
    res.send(err.message);
  }
}

//! Falta finalizar el controller de explorar

// async function explore(req, res) {
//   try {
//     const users = await usersRepository.getUsersByName('o');
//     const users = await usersRepository.getUsersByRole('player');
//     const users = await usersRepository.getUsersByPosition('mid');
//     const users = await usersRepository.getUsersByProvince('Madrid');
//     const users = await usersRepository.getUsersByTeam("2");
//     const users = await usersRepository.getUsersByAge('DESC');
//     const users = await usersRepository.getUsersByRank();

//     res.send(users);
//   } catch (err) {
//     console.log(err);
//     res.send(err.message);
//   }
// }

module.exports = {
  register,
  update,
  login,
  getProfile,
  followUser,
  unfollowUser,
  userLikesPost,
  userUnlikesPost,
  userSharesPost,
  userUnsharesPost,
  // explore,
};
