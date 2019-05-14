'use strict';

const cognitiveController = require('./controllers/cognitiveServicesController');
const faceController = require('./controllers/faceController');

module.exports = function (app) {

	/**
	 * All detections - All in one
	 */

	app.route('/detection')
		.post(cognitiveController.detection);


	/**
	 * Face routes
	 */

	//Route d'ajout de visage'
	app.route('/face/add')
		.post(faceController.add_face);

	
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
