'use strict';
module.exports = function(app) {

	var face = require('../controllers/faceController');

	//Face Routes

	//Route test
	app.route('/faces')
		.get(face.test_faces);

	//Route de détection de visages
	app.route('/faces')
		.post(face.get_faces);

	//Route de lecture des émotions
	app.route('/emotions')
		.post(face.get_emotions);

	//Route d'ajout de visage'
	app.route('/add')
		.post(face.add_face);

	//Route de lecture de visage ajouté
	app.route('/added_face')
		.post(face.get_added_face);
};
