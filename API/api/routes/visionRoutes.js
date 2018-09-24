'use strict';
module.exports = function(app) {

	var vision = require('../controllers/visionController');

	// vision Routes
	app.route('/testVision')
		.get(vision.test_vision);

	//Route de description de paysage
	app.route('/landscape')
		.post(vision.get_landscape);

	//Route de description de paysage urbain
	app.route('/outdoors')
		.post(vision.get_outdoors);

	//Route de description de l'intérieur
	app.route('/indoors')
		.post(vision.get_indoors);
};
