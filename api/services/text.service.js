const MicrosoftCognitive = require('./CoginitiveServices');
const errorsConstants = require('../constants/errors');
const sleep = require('sleep');

exports.getTexts = async (imageBinary) => {
    try {
        var recognizeText = await MicrosoftCognitive.Text.recognizeText(imageBinary);
        var response = recognizeText.headers;
        var j = 0;
        while (j < 8) {
            sleep.sleep(1);
            var readText = await MicrosoftCognitive.Text.readText(response);
            var message = '';
            if (readText.status === 'Succeeded') {
                for (var i = 0, len = readText['recognitionResult']['lines'].length; i < len; i++) {
                    message += readText['recognitionResult']['lines'][i]['text'] + '. ';
                }
                return message;
            } else {
                j++
            }
        }
        throw (errorsConstants.NO_TEXT);
    } catch (error) {
        if (error.message == "Error: Argument error, options.body.") {
            throw (errorsConstants.FILE_ERROR);
        } else {
            throw (error);
        }
    }
}
