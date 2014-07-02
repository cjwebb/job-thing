var config = require('./config.js');
var hasher = require('./auth/hasher.js');
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

/* Create user with given name, email and password. If successful, returns new user id */
var createUser = function(user, cb) {
	userWithEmailExists(user.email, function(err, exists){
		if (err) cb(err);

		if (exists) {
			cb(new Error("Email address already in use"));
		} else {

            hasher.cryptPassword(user.password, function(err, hash) {
                if (err) { return cb(err); }

			    connection.query("insert into users(name, email, password) values (?, ?, ?)",
	 			    [user.name, user.email, hash], function(err, results){
					    cb(err, results.insertId);
			    });
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

// this needs hashing stuff too
var checkEmailAndPassword = function(user, cb){

	connection.query("select * from users where email = ?",
		[user.email], function(err, results){
			if (err) {
				cb(err);
			} else {
				if (results.length === 1) {
                    
                    hasher.comparePassword(user.password, results[0]['password'], function(err, passwordmatch) { 
                        if (passwordmatch) { 
                            cb(null, results[0]['id']); 
                        } else { 
                            cb(new Error("Incorrect password")); 
                        }
                    });


				} else {
					cb(new Error("There are no users matching this email/password. Or too many..."));
				}				
			}
		});
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.checkEmailAndPassword = checkEmailAndPassword;
