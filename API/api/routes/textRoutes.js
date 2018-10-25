'use strict';
module.exports = function(app) {

	var text = require('../controllers/textController');

	// text Routes

	//Route test
	app.route('/text')
		.get(text.test_text);

	//Route de détection de texte
	app.route('/text')
		.post(text.detect_text);

	//Route de lecture de texte
	app.route('/read')
		.post(text.read_text);
};
