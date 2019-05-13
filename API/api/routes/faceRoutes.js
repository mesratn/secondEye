'use strict';
module.exports = function(app) {

	var face = require('../controllers/faceController');

	//Route de détection de visages
	app.route('/faces')
		.post(face.all_faces_informations);

	//Route d'ajout de visage'
	app.route('/face/add')
		.post(face.add_face);
};
