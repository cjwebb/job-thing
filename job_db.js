var config = require('./config.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: config.sql_host,
	user: config.sql_user,
	password: config.sql_password,
	database: config.sql_database
});

var createJob = function(job, cb){
	connection.query("insert into jobs(title, link, description, contact_email, rate) values (?, ?, ?, ?, ?)",
		[job.title, job.link, job.description, job.contactEmail, job.rate],
		function(err, results){
			cb(err, results.insertId);
		});
};

var getJob = function(jobId, cb){
	connection.query("select * from jobs where id = ?", [jobId],
		function(err, results){
			cb(err, results);
		});
};

/* TODO: Make this userId specific, only see jobs relevant to you. */
exports.getJobs = function(cb) {
    connection.query("select * from jobs",
        function(err, results) { cb(err, results); } );
}

exports.createJob = createJob;
exports.getJob = getJob;
