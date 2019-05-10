const MicrosoftCognitive = require('./microsoft.api');
const errorsConstants = require('../constants/errors');

exports.getFacesInformations = async (imageBinary) => {
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,smile,glasses"
    };

    try {
        var data = await MicrosoftCognitive.Face.detect(imageBinary, params);

        if (data.length == 0) {
            throw (errorsConstants.NO_FACE);
        }

        const analyse = {
            faces: []
        };

        for (let i = 0; i < data.length; i++) {
            let { gender, age } = data[i].faceAttributes;
            analyse['faces'].push({ gender, age });
        }

        return analyse;
    } catch (error) {
        if (error.message == "Error: Argument error, options.body.") {
            throw (errorsConstants.FILE_ERROR);
        } else {
            throw (error);
        }
    }
}

exports.getFacesEmotions = async (imageBinary) => {
    // Request parameters
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,smile,glasses,emotion"
    };

    try {
        var data = await MicrosoftCognitive.Face.detect(imageBinary, params);

        if (data.length == 0) {
            throw (errorsConstants.NO_FACE);
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

        return analyse;
    } catch (error) {
        if (error.message == "Error: Argument error, options.body.") {
            throw (errorsConstants.FILE_ERROR);
        } else {
            throw (error);
        }
    }
}

exports.addPersonFace = async (imageBinary, name) => {
    try {
        var createPerson = await MicrosoftCognitive.PersonGroup.create(name);
        var personId = createPerson.personId;

        var params = {
            "personId": personId
        };

        var uploadImage = await MicrosoftCognitive.PersonGroup.addFace(imageBinary, params);

        var trainIA = await MicrosoftCognitive.PersonGroup.train();

        return trainIA;
    } catch (error) {
        throw (error);
    }
}

exports.getPersonName = async (imageBinary) => {
    try {
        const params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false"
        };

        var person = await MicrosoftCognitive.Face.detect(imageBinary, params);

        if (person.length == 0)
            throw errorsConstants.NO_FACE;

        const IDs = person.map((p) => p.faceId);

        const personsID = await MicrosoftCognitive.PersonGroup.identify('group1', IDs);

        const savedIDs = personsID.map((p) => {
            if (p.candidates && p.candidates.length > 0)
                return p.candidates[0].personId
        });

        var personsNames = [];
        var personsErrors = [];

        for (let ID in savedIDs) {
            try {
                var personName = await MicrosoftCognitive.PersonGroupPerson.getPersonName('group1', savedIDs[ID]);
                personsNames.push(personName);
            } catch (e) {
                personsErrors.push(e);
            }
        }

        if (personsNames.length == 0)
            throw errorsConstants.NO_SAVED_FACE;
        else
            return personsNames.map((n) => {
                return n.name;
            });
    } catch(error) {
        throw (error);
    }
}