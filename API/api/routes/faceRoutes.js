'use strict';
module.exports = function(app) {

	var face = require('../controllers/faceController');

	//Face Routes

	//Route test
	app.route('/faces')
		.get(face.test_faces);

	//Route de détection de visages
	app.route('/faces')
		.post(face.all_faces_informations);

	//Route de lecture des émotions
	app.route('/emotions')
		.post(face.get_emotions);

	//Route d'ajout de visage'
	app.route('/face/add')
		.post(face.add_face);

	//Route de lecture de visage ajouté
	app.route('/face/added')
		.post(face.get_added_face);
};
