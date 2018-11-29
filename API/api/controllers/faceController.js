'use strict';

var request = require('request');
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;

exports.test_faces = function (req, res) {
    res.json({
        message: 'Test face OK'
    });
};


/*
 * Fonction qui détecte la présence de visages dans une image
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      - 400, error
 *      - 200, json
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Face:detect
 */
exports.get_faces = function (req, res) {
    // Request parameters
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,smile,glasses"
    };
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);

    //Request options
    const options = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    // Perform the REST API call.
    request.post(options, (error, response, body) => {
        if (error) {
            res.status(400).send(error);
        }
        let data = JSON.parse(body);
        var faceCount = '"I detect ' + data.length + ' faces!"';
        var response = '{"global" :' + faceCount + ', "faces":[';
        var i;
        for (i = 0; i < data.length; i++) {
            if (i == 0)
                var responseString = '{"message": ';
            else
                var responseString = ',{"message": ';
            if (data.length == 1)
                responseString += '"Here is what I detect in this face';
            else
                responseString += '"For the face number ' + (i + 1);
            var gender = data[i].faceAttributes.gender;
            responseString += '. The gender is : ' + gender;
            var age = data[i].faceAttributes.age;
            responseString += '. The age is estimated to : ' + age + '."}';
            response += responseString;
        }
        response += ']}'
        response = JSON.parse(response);
        res.json(response);
    });
};

/*
 * Fonction qui détecte les émotions sur les visages dans une image
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      - 400, error
 *      - 200, json
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Face:detect
 */
exports.get_emotions = (req, res) => {
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);

    // Request parameters
    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,smile,glasses,emotion"
    };

    //Request options
    const options = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    // Perform the REST API call.
    request.post(options, (error, response, body) => {
        if (error) {
            res.status(400).send(error);
        }

        const data = JSON.parse(body);
        const analyse = {
            global: `I detect ${data.length} faces!`,
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

            if (data.length == 1)
                var startString = 'Here is what I detect in this face';
            else
                var startString = `For the face number ${i + 1}`;

            let message = {
                message: `${startString}. The most shown emotion is ${rightEmotion}.`
            }

            analyse['faces'].push(message);
        }

        res.json(analyse);
    });
};

/*
 * Fonction qui lie un nom à un visage
 * @body :
 *      data : l'image en b64
 *      name : nom de la personne
 *
 * @return :
 *      -
 *
 * Cette fonction fait 3 appels à l'API Microsoft :
 * PersonGroup Person:Creat (recupère le personID)
 * PersonGroup Person:Add Face (envoie l'image et le personID et recupère le persistedFaceID)
 * PersonGroup:Train Enregistre les personne et sert à les préparer pour le détect
 */
exports.add_face = function (req, res) {
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);
    const name = req.body.name;
    const option = {
        uri: process.env.FACE_API_URL + '/persongroups/group1/persons',
        body: "{'name': '" + name + "'}",
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    request.post(option, (error, response, body) => {
        if (error) {
            res.status(400).send(error);
        }
        let data = JSON.parse(body);
        var personId = data.personId;
        var params = {
            "personId": personId
        };
        const options = {
            uri: process.env.FACE_API_URL + '/persongroups/group1/persons/${personId}/persistedFaces?',
            qs: params,
            body: imageBinary,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
            }
        };
        request.post(options, (error, response, body) => {
            if (error) {
                res.status(400).send(error);
            }

            let data2 = JSON.parse(body);
            var persistedId = data2.persistedFaceId;

            const train_options = {
                uri: process.env.FACE_API_URL + '/persongroups/group1/train',
                body: '',
                headers: {
                    'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
                }
            };
            request.post(train_options, (error, response, body) => {
                if (error) {
                    res.status(400).send(error);
                }

                res.status(200).send("Person added");
            })
        });
    });
};

/*
 * Fonction qui détecte les personnes enregistrés
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      -
 *
 * Cette fonction fait 3 appels à l'API Microsoft :
 * Face:Detect (recupère le FaceID)
 * Face:Identify (envoie les FaceID et récupère les personID)
 * PersonGroup Person:Get (Envoie le personID et récupère le name)
 */
exports.get_added_face = function (req, res) {
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);

    const params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false"
    };

    //Request options
    const getFacesID = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    request.post(getFacesID, (error, response, body) => {
        if (error) {
            res.status(400).send(error);
        }

        const facesID = JSON.parse(body);
        const IDs = facesID.map((f) => f.faceId);

        const getPersonsID = {
            uri: process.env.FACE_API_URL + '/identify',
            body: JSON.stringify({
                personGroupId: 'group1',
                faceIds: IDs
            }),
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
            }
        };

        request.post(getPersonsID, (error, response, body) => {
            if (error) {
                res.status(400).send(error);
                return;
            }

            const personsID = JSON.parse(body);
            const savedIDs = personsID.map((p) => {
                if (p.candidates && p.candidates.length > 0)
                    return p.candidates[0].personId
            });

            const getName = {
                uri: process.env.FACE_API_URL  + `persongroups/group1/persons/${savedIDs[0]}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
                }
            };

            request.get(getName, (error, response, body) => {
                if (error) {
                    res.status(400).send(error);
                }

                let name = JSON.parse(body);

                res.status(200).send('Oh, this is ' + name.name);
            });

        });

    });
};
