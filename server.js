var express = require('express'),
	bodyParser = require('body-parser'),
    exphbs  = require('express3-handlebars'),
    user_db = require('./user_db.js'),
    job_db = require('./job_db.js'),
	app = express();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	res.render('home', {title: "hello"});
});

app.post('/', function(req, res){
	var user = {
		email: req.body.emailAddress,
		password: req.body.password
	};
	user_db.checkEmailAndPassword(user, function(err, userId){
		if (err) console.log(err); // need to display this as form error
		res.redirect('/user/' + userId);
	});
});

app.get('/user/:id', function(req, res){
	var id = req.params.id;
	user_db.getUser(id, function(err, user){
		res.render('user', {users: user})
	});
});

app.get('/register', function(req, res){
	res.render('register', {title: "user"});
});

app.post('/register', function(req, res){
	var user = {
		name: req.body.name,
		email: req.body.emailAddress,
		password: req.body.password
	};
	user_db.createUser(user, function(err, userId){
		if (err) {
			console.log(err);
		} else {
			res.redirect('/user/' + userId);	
		}
	});
});

app.get('/jobs/create', function(req, res){
	res.render('createJob');
});

app.post('/jobs/create', function(req, res){
	var job = {
		title: req.body.title,
		link: req.body.link,
		description: req.body.description,
		contactEmail: req.body.contactEmail,
		rate: req.body.rate
	};
	job_db.createJob(job, function(err, jobId){
		res.redirect('/jobs/' + jobId); // todo: maybe we should generate a good permalink for this?
	});
});

app.get('/jobs/:id', function(req, res){
	var id = req.params.id;
	job_db.getJob(id, function(err, jobs){
		res.render("job", {jobs: jobs});
	});
});

app.listen(process.env.PORT || 3000);
