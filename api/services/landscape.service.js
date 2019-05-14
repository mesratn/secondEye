const MicrosoftCognitive = require('./microsoft.api');
const errorsConstants = require('../constants/errors');


exports.getLandscapes = async (imageBinary) => {
    try {
        var landscape = await MicrosoftCognitive.Landscape.getLandscape(imageBinary);

        if ('description' in landscape) {
            var response = [];

            for (let i in landscape['description']['captions']) {
                response.push(landscape['description']['captions'][i]['text']);
            }

            return response;
        } else {
            if ('code' in data) // TODO: use errorsConstant
                throw (data);
            else
                throw (errorsConstants.UNHANDLED_ERROR);
        }
    } catch (error) {
        next(error);   
    }
}