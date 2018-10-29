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
 *      url : url de l'image
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
    var sourceImageUrl = req.body.url;

    //Request options
    const options = {
        uri: process.env.FACE_API_URL + '/detect',
        qs: params,
        body: '{"url": ' + '"' + sourceImageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.FACE_API_KEY
        }
    };

    // Perform the REST API call.
    request.post(options, (error, response, body) => {
        if (error) {
            res.send(error, 400);
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
 *      url : url de l'image
 *
 * @return :
 *      - 400, error
 *      - 200, json
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Face:detect
 */
exports.get_emotions = (req, res) => {
    const sourceImageURI = req.body.data;
    const imageBinary = converteur(sourceImageURI);

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
        if (error) { res.send(error); return; }

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
 *      url : url de l'image
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
    var url = req.body.url;
    var name = req.body.name;
    const option = {
        uri: face_api_url + '/persongroups/group1/persons',
        body: "{'name': '" + name + "'}",
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': face_api_key
        }
    };

    request.post(option, (error, response, body) => {
        if (error) {
            res.send(error);
        }
        let data = JSON.parse(body);
        var personId = data.personId;
        console.log("person id");
        console.log(personId);
        var params = {
            "personId": personId
        };
        console.log(url);
        const options = {
            uri: face_api_url + '/persongroups/group1/persons/{personId}/persistedFaces?',
            qs: params,
            body: "{'url': '" + url + "'}",
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': face_api_key
            }
        };
        request.post(options, (error, response, body) => {
            if (error) {
                res.send(error);
            }

            let data2 = JSON.parse(body);
            var persistedId = data2.persistedFaceId;
            console.log("persisted id");
            console.log(persistedId);
            res.json(persistedId);
        });
    });


};

/*
 * Fonction qui détecte les personnes enregistrés
 * @body :
 *      url : url de l'image
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
    const options = {
        uri: face_api_url + 'persongroups/group1/persons/7751faf5-781f-485d-b454-341b165bb4e7',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': face_api_key
        }
    };
    request.get(options, (error, response, body) => {
        if (error) {
            res.send(error);
        }
        let data = JSON.parse(body);
        console.log(data.name);
        res.json({
            message: "The name is " + data.name + " ."
        })

    });
};