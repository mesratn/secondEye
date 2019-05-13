'use strict';

var request = require('request');
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
const API = require('../services/api');

/*
 * Fonction qui détecte la présence de visages dans une image
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      - 400, error
 *      - 520, unknown error
 *      - 200, json
 *
 * Cette fonction fait appel à l'API Microsoft :
 * Face:detect
 */


exports.all_faces_informations = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);

        var informations = await API.getFacesAllInformations(imageBinary);
        res.json(informations);
    } catch (e) {
        next(e);
    }
    
}

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

        var addFace = await API.addPersonFace(imageBinary, name);

        res.status(200).send({
            message: 'Person added'
        });
    } catch (e) {
        next(e);
    }
}