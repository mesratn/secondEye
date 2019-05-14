
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
const faceService = require('../services/face.service');

exports.detection = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);
    } catch (e) {
        // bad image format or bad parameter
        next(e);
    }

    const results = {}
    var facesDetection, landscapesDetection, textDetection;

    // Faces informations

    try {
        var informations = await faceService.getFaces(imageBinary);
        facesDetection = true;
    } catch (e) {
        facesDetection = e;
    }

    if (facesDetection === true || landscapesDetection === true || textDetection === true) {
        res.json({
            faces: facesDetection === true ? informations : false,
            landscape: landscapesDetection === true ? true : false,
            textDetection: textDetection === true ? true : false
        });
    } else {
        res.json({
            faces: facesDetection,
            landscape: landscapesDetection,
            textDetection: textDetection
        });
    }
    
}