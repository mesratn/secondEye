const MicrosoftCognitive = require('./CoginitiveServices');
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
            if ('code' in landscape) // TODO: use errorsConstant
                throw (landscape.code);
            else
                throw (errorsConstants.NO_LANDSCAPE);
        }
    } catch (error) {
        if (error.message == "Error: Argument error, options.body.") {
            throw (errorsConstants.FILE_ERROR);
        } else {
            throw (error);
        }  
    }
}
