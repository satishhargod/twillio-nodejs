const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const videoChatValidation = require('../../validations/videochat.validation');
const videoChatController = require('../../controllers/videochat.controller');

const router = express.Router();

router.route('/create-room').post( validate(videoChatValidation.createRoom),  videoChatController.createRoom);
router.route('/create-token').post( validate(videoChatValidation.createToken),  videoChatController.createToken);
router.route('/join-room').post( validate(videoChatValidation.joinRoom),  videoChatController.joinRoom);


module.exports = router;