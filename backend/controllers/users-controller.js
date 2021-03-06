'use strict';

const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mailgun = require('mailgun-js');
const sharp = require('sharp');
const uuid = require('uuid');
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
      rank: Joi.string().max(2).allow(null, ''),
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

    const mg = mailgun({ apiKey: process.env.MAILGUN_KEY, domain: process.env.MAILGUN_DOMAIN });
    const data = {
      from: 'eSports Talents <esportstalents@outlook.com>',
      to: `${email}`,
      subject: `¡Bienvenido ${name}!`,
      html: `<h1>¡Bienvenido a eSports Talents ${name}!</h1>\n<p>Esperamos que disfrutes de la página, si tienes alguna duda o problema no dudes en contactar con nuestro equipo de soporte :)</p>`,
    };
    await mg.messages().send(data);

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
      name: Joi.string().max(40).allow(null, ''),
      lastname: Joi.string().max(100).allow(null, ''),
      email: Joi.string().email().max(100).allow(null, ''),
      nickname: Joi.string().max(40).allow(null, ''),
      password: Joi.string().min(4).max(20).allow(null, ''),
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

async function uploadAvatar(req, res) {
  try {
    if (!req.files) {
      const error = new Error('El archivo no existe');
      error.status = 409;
      throw error;
    } else {
      const { userRole } = req.auth;
      const userId = req.auth.teamId || req.auth.userId;

      const avatar = req.files.avatar;
      const imageId = uuid.v4();
      const image = sharp(avatar.data);
      image.resize(400, 400);
      await image.toFile(`./uploads/${imageId}.jpg`);

      if (userRole === 'team') {
        await teamsRepository.updateTeamLogo(`${imageId}.jpg`, userId);
      } else {
        await usersRepository.updateUserPhoto(`${imageId}.jpg`, userId);
      }

      res.send({
        message: 'El archivo se ha subido correctamente',
        data: {
          avatar: `${imageId}.jpg`,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
    res.send({ error: err.message });
  }
}

async function uploadHeader(req, res) {
  try {
    if (!req.files) {
      const error = new Error('El archivo no existe');
      error.status = 409;
      throw error;
    } else {
      const { userRole } = req.auth;
      const userId = req.auth.teamId || req.auth.userId;

      const header = req.files.header;
      const imageId = uuid.v4();
      const image = sharp(header.data);
      image.resize(1500, 500);
      await image.toFile(`./uploads/${imageId}.jpg`);

      if (userRole === 'team') {
        await teamsRepository.updateTeamHeader(`${imageId}.jpg`, userId);
      } else {
        await usersRepository.updateUserHeader(`${imageId}.jpg`, userId);
      }

      res.send({
        message: 'El archivo se ha subido correctamente',
        data: {
          avatar: `${imageId}.jpg`,
        },
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500);
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

      const tokenPayload = {
        teamId: team.team_id,
        teamName: team.team_name,
        teamEmail: team.team_email,
        userRole: 'team',
      };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '30d' });

      res.send({ accessToken: token });
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

    res.send({ accessToken: token });
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

    const followersCount = await usersRepository.getUserFollowersCount(userId);
    const followingCount = await usersRepository.getUserFollowingCount(userId);

    const userPosts = await postsRepository.getUserPosts(userId);

    const profile = {
      userInfo: { ...user, ...followersCount, ...followingCount },
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

async function checkUserFollow(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userFollowing = decodedToken.userId;
    const userFollowed = req.params.userId;
    const followCheck = await usersRepository.followCheck(userFollowing, userFollowed);

    res.send(followCheck);
  } catch (err) {
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

async function checkUserLike(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userLiking = decodedToken.userId;
    const postId = req.params.postId;
    const likeCheck = await usersRepository.likeCheck(userLiking, postId);

    res.send(likeCheck);
  } catch (err) {
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
    res.send({ Error: err.message });
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
    res.send({ Error: err.message });
  }
}

async function checkUserShare(req, res) {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userSharing = decodedToken.userId;
    const postShared = req.params.postId;
    const shareCheck = await usersRepository.shareCheck(userSharing, postShared);

    res.send(shareCheck);
  } catch (err) {
    console.log(err);
    res.send({ Error: err.message });
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
    res.send({ Error: err.message });
  }
}

async function explore(req, res) {
  try {
    const queryType = req.query.type;
    const querySchema = Joi.string().valid('name', 'rank', 'age', 'role', 'position', 'province', 'team');
    await querySchema.validateAsync(queryType);

    let users = [];

    if (queryType === 'name') {
      const nameQuery = req.query.name;
      users = await usersRepository.getUsersByName(nameQuery);
    } else if (queryType === 'rank') {
      const rankOrder = req.query.order;
      users = await usersRepository.getUsersByRank(rankOrder);
    } else if (queryType === 'age') {
      const ageOrder = req.query.order;
      users = await usersRepository.getUsersByAge(ageOrder);
    } else if (queryType === 'role') {
      const role = req.query.role;
      users = await usersRepository.getUsersByRole(role);
    } else if (queryType === 'position') {
      const position = req.query.position;
      users = await usersRepository.getUsersByPosition(position);
    } else if (queryType === 'province') {
      const province = req.query.province;
      users = await usersRepository.getUsersByProvince(province);
    } else if (queryType === 'team') {
      const team = req.query.team;
      users = await usersRepository.getUsersByTeam(team);
    } else {
      throw new Error('Búsqueda inválida');
    }

    res.send(users);
  } catch (err) {
    console.log(err);
    res.send({ Error: err.message });
  }
}

module.exports = {
  register,
  update,
  uploadAvatar,
  uploadHeader,
  login,
  getProfile,
  followUser,
  checkUserFollow,
  unfollowUser,
  userLikesPost,
  checkUserLike,
  userUnlikesPost,
  userSharesPost,
  checkUserShare,
  userUnsharesPost,
  explore,
};
