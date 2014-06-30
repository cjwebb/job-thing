var config = require('./config.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: config.sql_host,
	user: config.sql_user,
	password: config.sql_password,
	database: config.sql_database
});

var getUserWithEmail = function(emailAddress, cb) {
	connection.query("select * from users where email = ?", [emailAddress],
		function(err, results){
			cb(err, results);
		});
};

var userWithEmailExists = function(emailAddress, cb) {
	getUserWithEmail(emailAddress, function(err, results){
		if (err) cb(err);

		if (results.length > 0) {
			cb(null, true);
		} else {
			cb(null, false);
		}
	});
};

/* WARNING: this doesn't hash passwords yet!!! */
/* Create user with given name, email and password. If successful, returns new user id */
var createUser = function(user, cb) {
	userWithEmailExists(user.email, function(err, exists){
		if (err) cb(err);

		if (exists) {
			cb(new Error("Email address already in use"));
		} else {
			connection.query("insert into users(name, email, password) values (?, ?, ?)",
	 			[user.name, user.email, user.password], function(err, results){
					cb(err, results.insertId);
			});
		}
	});
};

var getUser = function(userId, cb) {
	connection.query("select * from users where id = ?", [userId],
	 function(err, results){
		cb(err, results);
	});
};

exports.createUser = createUser;
exports.getUser = getUser;
