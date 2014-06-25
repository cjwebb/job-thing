var config = require('./config.js');
var mysql = require('mysql');

console.log("*-- SQL CONFIG --*")
console.log(config.sql_host);
console.log(config.sql_user);
console.log(config.sql_password);

var connection = mysql.createConnection({
	host: config.sql_host,
	user: config.sql_user,
	password: config.sql_password,
	database: config.sql_database
});


/* WARNING: this doesn't hash passwords yet!!! */
/* Create user with given name, email and password. If successful, returns new user id */
var createUser = function(user, cb) {
	connection.query("insert into users(name, email, password) values (?, ?, ?)",
	 [user.name, user.email, user.password], function(err, results){
	 	if (err) throw err;

	 	console.log(results);
		cb(null, results.insertId);
	});
};

exports.createUser = createUser;
