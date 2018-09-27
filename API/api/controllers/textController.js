'use strict';

// Clé API TEXT de Microsoft, mais je crois que maintenant c'est inclu dans API VISION
//var text_api_key = "0ed0b17f35dd4a80b53ba50731668f85";

var vision_api_key = "746202e68e074d51983b4e8e4a95ff7a";
var vision_api_url = "https://westeurope.api.cognitive.microsoft.com/vision/v2.0/";
var request = require('request');

exports.test_text = function(req, res) {
    res.json({ message: 'Test Text OK' });
};

//je crois que la route par defaut de vision, si on met un menu elle dit juste qu'il y a un menu, donc c'est juste une detection
exports.detect_text = function(req, res) {
    const sourceImageUrl = req.body.url;
    const params = {
        'visualFeatures': 'Categories',
    };

    const options = {
        uri: vision_api_url + 'analyze',
        qs: params,
        body: '{"url": "' + sourceImageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : vision_api_key
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            res.send(error);
        }

        let data = JSON.parse(body);
        console.log(data['categories'][0]['name']);
        if (data['categories'][0]['name'].includes("text")) {
            res.json({message: 'Image contains text'});
        } else {
            res.json({message: 'Image does not contains text'});
        }
    });
};

//lecture de texte
exports.read_text = function(req, res) {
    const sourceImageUrl = req.body.url;
    const params = {
        'mode': 'Handwritten',
    };

    const options = {
        uri: vision_api_url + 'recognizeText',
        qs: params,
        body: '{"url": "' + sourceImageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : vision_api_key
        }
    };

    console.log(options);

    request.post(options, (error, response, body) => {
        if (error) {
            console.log("ERROR");
            res.send(error);
        } else {
            console.log(response['IncomingMessage']);
            let data = JSON.parse(response);
            console.log(data['IncomingMessage']);
        }
    });
};
