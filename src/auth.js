var db = require('./database');

module.exports = function (email, password, cb) {
	var users = db.handle.collection('users');

	users.findOne({ email: email, password: password }, function (err, user) {
		if (err) {
			console.error('database error:', err);
			cb(err);

			return;
		}

		if (user) {
			cb(null, user);
		}
		else {
			cb(new Error('Invalid credentials.'));
		}
	});
};

module.exports.session_handler = function (req, res, next) {
	if (!req.session) {
		req.session = { user: null };
	}

	next();
};

module.exports.create = function (email, password, name, cb) {
	if (name === '') {
		var err = new Error('Name must not be empty.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	if (email === '') {
		var err = new Error('Email must not be empty.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	if (password.length < 4) {
		var err = new Error('Password must have at least 4 characters.');
		err.user_presentable = true;

		cb(err);

		return;
	}

	var users = db.handle.collection('users');

	users.findOne({ email: email }, function (err, existing_user) {
		if (err) {
			cb(err);
			return;
		}

		if (existing_user) {
			var err = new Error('A user with this email address already exists in the database.');
			err.user_presentable = true;

			cb(err);

			return;
		}
		else {
			users.insert({ name: name, email: email, password: password }, function (err) {
				if (err) {
					cb(err);
					return;
				}

				cb(null);
			});
		}
	});
};
