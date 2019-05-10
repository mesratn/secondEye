'use strict';

var request = require('request');
var converteur = require('../services/b64ToBinary').convertDataURIToBinary;
const API = require('../services/api');

exports.test_faces = function (req, res) {
    res.json({
        message: 'Test face OK'
    });
};


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

exports.get_faces = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);

        var informations = await API.getFacesInformations(imageBinary);

        res.json(informations);
    } catch(e) {
        next(e);
    }
}

/*
 * Fonction qui détecte les émotions sur les visages dans une image
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
exports.get_emotions = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);

        var emotions = await API.getFacesEmotions(imageBinary);

        res.json(emotions);
    } catch(e) {
        next(e);
    }
};

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

/*
 * Fonction qui détecte les personnes enregistrés
 * @body :
 *      data : l'image en b64
 *
 * @return :
 *      -
 *
 * Cette fonction fait 3 appels à l'API Microsoft :
 * Face:Detect (recupère le FaceID)
 * Face:Identify (envoie les FaceID et récupère les personID)
 * PersonGroup Person:Get (Envoie le personID et récupère le name)
 */

exports.get_added_face = async (req, res, next) => {
    try {
        const sourceImage = req.body.data;
        const imageBinary = converteur(sourceImage);

        var names = await API.getPersonName(imageBinary);

        res.json(names);
    } catch (e) {
        next(e);
    }
}