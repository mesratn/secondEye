const MicrosoftCognitive = require('./CoginitiveServices');
const errorsConstants = require('../constants/errors');

exports.getFaces = async (imageBinary) => {
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,smile,glasses,emotion"
    }

    try {
        // Base informations (Emotions, age, gender, personID)

        var persons = await MicrosoftCognitive.Face.detect(imageBinary, params);

        if (persons.length == 0)
            throw (errorsConstants.NO_FACE);

        var IDs = [];
        var analyse = [];
        
        for (let i = 0; i < persons.length; i++) {
            let { gender, age } = persons[i].faceAttributes;
            IDs.push(persons[i].faceId);

            let emotionsArray = persons[i].faceAttributes.emotion;
            let biggestScore = 0;

            for (let key in emotionsArray) {
                if (emotionsArray[key] > biggestScore) {
                    biggestScore = emotionsArray[key];
                    emotion = key;
                }
            }

            let message = {
                gender,
                age,
                emotion
            }

            analyse.push(message);
        }

        // Check for saved faces

        const personsID = await MicrosoftCognitive.PersonGroup.identify('group1', IDs);

        const savedIDs = personsID.map((p) => {
            if (p.candidates && p.candidates.length > 0)
                return p.candidates[0].personId
        });

        // If saved faces detected, get corresponding names

        for (let ID in savedIDs) {
            if (savedIDs[ID] != undefined) {
                try {
                    let personName = await MicrosoftCognitive.PersonGroupPerson.getPersonName('group1', savedIDs[ID]);
                    analyse[ID]['name'] = personName.name;
                } catch (e) {
                    // Do nothing
                }
            }
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
        if (error.message == "Error: Argument error, options.body.") {
            throw (errorsConstants.FILE_ERROR);
        } else {
            throw (error);
        }
    }
}
