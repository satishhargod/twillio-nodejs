const Joi = require('joi');
const { password, objectId, notallowspace} = require('./custom.validation');

const createRoom = {
  body: Joi.object().keys({
    roomname: Joi.string().required().custom(notallowspace),
    identity: Joi.string().required(),
  }),
};

const createToken = {
  body: Joi.object().keys({
    roomname: Joi.string().required().custom(notallowspace),
    identity: Joi.string().required(),
  }),
};

const joinRoom = {
  body: Joi.object().keys({
    roomname: Joi.string().required().custom(notallowspace),
    identity: Joi.string().required(),
  }),
};

module.exports = {
   createRoom,
   joinRoom,
   createToken
};
