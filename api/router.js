'use strict';

const cognitiveController = require('./controllers/cognitiveServicesController');
const faceController = require('./controllers/faceController');
const textController = require('./controllers/textController');
const visionController = require('./controllers/visionController');

module.exports = function (app) {

	/**
	 * All detections - All in one
	 */

	app.route('/detection')
		.post(cognitiveController.detection);


	/**
	 * Face routes
	 */

	//Route de détection de visages
	app.route('/faces')
		.post(faceController.all_faces_informations);

	//Route d'ajout de visage'
	app.route('/face/add')
		.post(faceController.add_face);


	/**
	 * Text routes
	 */

	//Route test
	app.route('/text')
		.get(textController.test_text);

	//Route de détection de texte
	app.route('/text')
		.post(textController.detect_text);

	//Route de lecture de texte
	app.route('/read')
		.post(textController.read_text);


	/**
	 * Landscape routes
	 */

	// vision Routes
	app.route('/vision')
		.get(visionController.test_vision);

	//Route de description de paysage
	app.route('/landscape')
		.post(visionController.get_landscape);

	//Route de description de paysage urbain
	app.route('/outdoors')
		.post(visionController.get_landscape);

	//Route de description de l'intérieur
	app.route('/indoors')
		.post(visionController.get_landscape);


	app.use((err, req, res, next) => {
		if (err) {
			if (err.httpCode)
				res.status(err.httpCode).send({ error: err.error });
			else
				res.status(520).send({ error: err + "" });
		} else {
			res.status(404).send({ error: req.originalUrl + ' not found' });
		}
	});
}