'use strict';

var request = require('request');

exports.test_vision = function(req, res) {
  res.json({ message: 'Test Vision OK' });
};

/*
 * Fonction qui décrit le paysage dans une image
 * @body :
 *      url : url de l'image
 *
 * @return :
 *      - 400, error
 *      - 200, json : message
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Vision:Analyze image
*/
exports.get_landscape = function(req, res) {
    const sourceImageUrl = req.body.url;
    const params = {
        'visualFeatures': 'Categories,Description,Color',
    };

    const options = {
        uri: process.env.VISION_API_URL + '/analyze',
        qs: params,
        body: '{"url": "' + sourceImageUrl + '"}',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key' : process.env.VISION_API_KEY
        }
    };

    request.post(options, (error, response, body) => {
        if (error) {
            res.send(error, 400);
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
