var express = require('express'),
	bodyParser = require('body-parser'),
    exphbs  = require('express3-handlebars'),
    user_db = require('./user_db.js'),
    job_db = require('./job_db.js'),
    session = require('express-session'),
	app = express();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'Node is for losers.'
}));
app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    next();
});


app.get('/', function(req, res){
    
    if (req.session.user) {
        console.log("user.name: " + req.session.user.name);
        console.log("user.id: " + req.session.user.id);
        res.render('homeNoLogin', {title: "Job Thing"});
    } else { 
        res.render('homeLogin', {title: "Job Thing"});
    }
});

app.post('/', function(req, res){
	var user = {
		email: req.body.emailAddress,
		password: req.body.password
	};
	user_db.checkEmailAndPassword(user, function(err, dbUser){
		if (err) { console.log(err); } // need to display this as form error
		
        req.session.regenerate(function(){
            req.session.user = dbUser;
            res.redirect('/jobs');
        });
        
	});
});

app.get('/logout', function(req, res) { 
    req.session.destroy(function(){
        res.redirect('/');
    });
});

function restrictProfile(req, res, next) {
    console.log("sess:" + req.session.user)
    if (req.session.user){ console.log("sess id:" + req.session.user.id + " req.para:" + req.params.id);}
    
    if (req.session.user && 
        req.session.user.id == req.params.id) {
        next();
    } else {
        console.log('Access denied!');
        res.redirect('/');
    }
}

app.get('/user/:id', restrictProfile, function(req, res){
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
            req.session.regenerate(function(){
                user.id = userId;
                req.session.user = user;
                res.redirect('/jobs');
            });
        }
	});
});

function restrictJobs(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        console.log('Please log in to view jobs');
        res.redirect('/');
    }
}

app.get('/jobs', restrictJobs, function(req, res) {
    job_db.getJobs(function(err, jobs) {
        if (err) {
            console.log("Error getting jobs: " + err);
        } else {
            res.render('listJobs', {jobs: jobs});
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
