const MicrosoftCognitive = require('./microsoft.api');
const errorsConstants = require('../constants/errors');

exports.getFacesInformations = (imageBinary) => {
    return new Promise((resolve, reject) => {
        // Request parameters
        const params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "age,gender,smile,glasses"
        };

        MicrosoftCognitive.detect(imageBinary, params).then(response => {
            const data = JSON.parse(response);

            if (data.length == 0) {
                reject(errorsConstants.NO_FACE);
            }
    
            const analyse = {
                faces: []
            };
    
            for (let i = 0; i < data.length; i++) {
                let { gender, age } = data[i].faceAttributes;
                analyse['faces'].push({ gender, age });
            }
    
            resolve(analyse);
        }).catch(error => {
            if (error.message == "Error: Argument error, options.body.") {
                reject(errorsConstants.FILE_ERROR)
            } else {
                let unknownError = errorsConstants.UNHANDLED_ERROR;
                unknownError.error = error + "";
                reject(unknownError);
            }
        });
    });
}

exports.getFacesEmotions = (imageBinary) => {
    return new Promise((resolve, reject) => {
        // Request parameters
        const params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes": "age,gender,smile,glasses,emotion"
        };

        MicrosoftCognitive.detect(imageBinary, params).then(response => {
            const data = JSON.parse(response);

            if (data.length == 0) {
                reject(errorsConstants.NO_FACE);
            }
    
            const analyse = {
                faces: []
            };
    
            for (let i = 0; i < data.length; i++) {
                var emotion = data[i].faceAttributes.emotion;
                var rightEmotion = "";
                var biggestScore = 0;
    
                for (let key in emotion) {
                    if (emotion[key] > biggestScore) {
                        biggestScore = emotion[key];
                        rightEmotion = key;
                    }
                }
    
                let message = {
                    emotion: rightEmotion,
                }
    
                analyse['faces'].push(message);
            }
    
            resolve(analyse);
        }).catch(error => {
            if (error.message == "Error: Argument error, options.body.") {
                reject(errorsConstants.FILE_ERROR)
            } else {
                let unknownError = errorsConstants.UNHANDLED_ERROR;
                unknownError.error = error + "";
                reject(unknownError);
            }
        });
    });
}