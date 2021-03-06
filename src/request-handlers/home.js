var post = require('../post');

module.exports = function (app) {
	app.get('/', function (req, res) {
		var template_data = {
			user: req.session.user
		};

		var include_unlisted = !!req.session.user;

		post.get(include_unlisted, function (err, posts) {
			if (err) {
				res.push_error_object(err);
				res.send_page('posts', template_data);

				return;
			}

			template_data.posts = posts;

			res.send_page('posts', template_data);
		});
	});
};

