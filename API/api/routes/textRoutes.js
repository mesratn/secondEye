'use strict';
module.exports = function(app) {

	var text = require('../controllers/textController');

	// text Routes

	//Route test
	app.route('/testText')
		.get(text.test_text);

	//Route de détection de texte
	app.route('/text')
		.get(text.detect_text);

	//Route de lecture de texte
	app.route('/readText')
		.get(text.read_text);
};
