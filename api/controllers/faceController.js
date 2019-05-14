'use strict';

var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
const FaceService = require('../services/face.service');

/*
 * Fonction qui lie un nom à un visage
 * @body :
 *      data : l'image en b64
 *      name : nom de la personne
 *
 * @return :
 *      -
 *
 * Cette fonction fait 3 appels à l'API Microsoft :
 * PersonGroup Person:Create (recupère le personID)
 * PersonGroup Person:Add Face (envoie l'image et le personID et recupère le persistedFaceID)
 * PersonGroup:Train Enregistre les personne et sert à les préparer pour le détect
 */

exports.add_face = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);
        const name = req.body.name;

        var addFace = await FaceService.addPersonFace(imageBinary, name);

        res.status(200).send({
            message: 'Person added'
        });
    } catch (e) {
        next(e);
    }
}