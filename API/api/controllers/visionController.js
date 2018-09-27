'use strict';

const vision_api_key = "746202e68e074d51983b4e8e4a95ff7a";
const vision_api_url = "https://westeurope.api.cognitive.microsoft.com/vision/v2.0/";
var request = require('request');

exports.test_vision = function(req, res) {
  res.json({ message: 'Test Vision OK' });
};

exports.get_landscape = function(req, res) {
    const sourceImageUrl = req.body.url;
    const params = {
        'visualFeatures': 'Categories,Description,Color',
    };

    const options = {
        uri: vision_api_url + '/analyze',
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
        if ('description' in data) {
            var response = '{"landscapes":[';
            for (var i = 0; i < data["description"]["captions"].length; ++i) {
                var text = data["description"]["captions"][i]["text"];

                if (i)
                    response += ',';
                response += '{"message": "' + text + '"}';
            }
            response += ']}';

            response = JSON.parse(response);
            res.json(response);
        } else if ('code' in data) {
            res.json({message: data['code']});
        } else {
            res.json({message: 'UnknownError'});
        }
    });


};
