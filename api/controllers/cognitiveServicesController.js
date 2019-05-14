
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
const faceService = require('../services/face.service');
const landscapeService = require('../services/landscape.service');
const textService = require('../services/text.service');

exports.detection = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);
        const results = {}
        var facesDetection, landscapesDetection, textDetection, informations, landscape, text;

        // Faces informations

        try {
            var informations = await faceService.getFaces(imageBinary);
            facesDetection = true;
        } catch (e) {
            facesDetection = e;
        }

        try {
            var landscape = await landscapeService.getLandscapes(imageBinary);
            landscapesDetection = true;
        } catch (e) {
            landscapesDetection = e;
        }

        try {
            var text = await textService.getTexts(imageBinary);
            textDetection = true;
        } catch (e) {
            textDetection = e;
        }

        if (facesDetection === true || landscapesDetection === true || textDetection === true) {
            res.json({
                faces: facesDetection === true ? informations : false,
                landscape: landscapesDetection === true ? landscape : false,
                textDetection: textDetection === true ? text : false
            });
        } else {
            res.json({
                faces: facesDetection,
                landscape: landscapesDetection,
                textDetection: textDetection
            });
        }
    } catch (e) {
        // bad image format or bad parameter
        next(e);
    }
}