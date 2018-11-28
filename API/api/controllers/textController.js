'use strict';

var request = require('request');
var sleep = require('sleep');
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
var async = require('async');

exports.test_text = function(req, res) {
    res.json({ message: 'Test Text OK' });
};

/*
 * Fonction qui détecte le texte dans une image
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      - 400, error
 *      - 200, json : message
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Vision:Analyze image
*/
exports.detect_text = function(req, res) {
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);
    const params = {
        'visualFeatures': 'Categories',
    };

    const options = {
        uri: process.env.VISION_API_URL + 'analyze',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            res.status(400).send(error);
        }
        let data = JSON.parse(body);

        if (data['categories'][0]['name'].includes("text")) {
            res.json({message: 'Image contains text'});
        } else {
            res.json({message: 'Image does not contains text'});
        }
    });
};

/*
 * Fonction qui lit le texte dans une image
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      - 400, error
 *      - 200, json : message
 *
 * Cette fonction fait 2 appels à l'API Microsoft :
 * Vision:Recognize Text
 * Vision:Get Recognize Text Operation Result
*/

exports.read_text = function(req, res) {
    const sourceImage = req.body.data;
    const imageBinary = converteur(sourceImage);
    const params = {
        'mode': 'Handwritten',
    };

    const options = {
        uri: process.env.VISION_API_URL + 'recognizeText',
        qs: params,
        body: imageBinary,
        headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        }
    };

    request.post(options).on('response', (response) => {
        var seconds = 4;
        const options_reading = {
            uri: response['headers']['operation-location'],
            headers: {
                'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
            }
        };

        async.whilst(
            function() {
                return seconds < 12;
            },
            function(callback) {
                sleep.sleep(seconds);
                request.get(options_reading, (error, response, body) => {
                    if (error) {
                        callback(err,null);
                    }
                    var data = JSON.parse(body);
                    var message = '';
                    if (data['status'] === 'Succeeded') {
                        for (var i = 0, len = data['recognitionResult']['lines'].length; i < len; i++) {
                            message += data['recognitionResult']['lines'][i]['text'] + '. ';
                        }
                        seconds = 12;
                        callback(null, message);
                    } else {
                        seconds += 4;
                    }
                });
            },
            function (err, n) {
                if(err) {
                    res.status(400).send(err);
                } else if (n) {
                    res.json({message: n});
                } else {
                    res.json({message: 'The message did not have time to be analyzed. Sorry.'});
                }
            }
        );
    });
};
