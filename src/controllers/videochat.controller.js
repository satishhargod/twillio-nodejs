const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');
const ResponseObject = require('../utils/ResponseObject');
const config = require('../config/config');
const accountSid = config.twilioAccountSid;
const authToken = config.twilioAuthToken;
const apiSecret = config.twilioApiSecret;
const apiKey = config.twilioApiKey;
const client = require('twilio')(accountSid, authToken);
const TwilioAccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = TwilioAccessToken.VideoGrant;

const createRoom = catchAsync(async (req, res) => {
    //const user = await userService.createUser(req.body);
    let roomname = req.body.roomname;
    let identity = req.body.identity;
    let result = await client.video.rooms.create({uniqueName: roomname})
      .then(room => {return room})
      .catch((err) =>{
        throw new ApiError(httpStatus.BAD_REQUEST, err);
      });
    
    let msg = "Room created successfully";
    res.status(httpStatus.CREATED).send(new ResponseObject(httpStatus.CREATED, msg,
        result
    ));
});

async function checkRoom(roomname){
    let result = await new Promise((resolve, reject) => {
        let result = client.video.rooms(roomname)
            .fetch()
            .then((room) => {
                let roomdata = {
                    error:false,
                    room:room
                }
                return roomdata;
            })
            .catch((err) => {
                let error = {
                    error:true,
                    room_error:err
                }
                return error;
            });
        resolve(result);
    });
    return result;    
}

const joinRoom = catchAsync(async (req, res) => {
    //const user = await userService.createUser(req.body);
    let roomname = req.body.roomname;
    let checktoken = await checkRoom(roomname);
    if(checktoken && checktoken.error && checktoken.error == true){
        let msg = "Room not exist";
        //checktoken.room_error;
        throw new ApiError(httpStatus.BAD_REQUEST, msg);
    }
    let identity = req.body.identity;
    let token = tokenGenerator(identity, roomname);
    let msg = "Token created successfully";
    let result = {
        identity:identity,
        room:roomname,
        token,
    }
    res.status(httpStatus.CREATED).send(new ResponseObject(httpStatus.CREATED, msg,
        result
    ));
});

const createToken = catchAsync(async (req, res) => {
    //const user = await userService.createUser(req.body);
    let roomname = req.body.roomname;
    
    let identity = req.body.identity;
    let token = tokenGenerator(identity, roomname);
    let msg = "Token created successfully";
    let result = {
        identity:identity,
        room:roomname,
        token,
    }
    res.status(httpStatus.CREATED).send(new ResponseObject(httpStatus.CREATED, msg,
        result
    ));
});

function tokenGenerator(identity, room) {

    // Create Video Grant
    const videoGrant = new VideoGrant({
      room: room,
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    let TWILIO_ACCOUNT_SID = accountSid;
    let TWILIO_API_KEY = apiKey;
    let TWILIO_API_SECRET = apiSecret;

    const token = new TwilioAccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      {identity: identity}
    );
    token.addGrant(videoGrant);
    
    return token.toJwt();
}

module.exports = {
    createRoom,
    createToken,
    joinRoom
};
