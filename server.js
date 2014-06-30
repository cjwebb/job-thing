var express = require('express'),
	bodyParser = require('body-parser'),
    exphbs  = require('express3-handlebars'),
    user_db = require('./user_db.js')
	app = express();

app.use(express.static(__dirname + '/public'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res){
	res.render('home', {title: "hello"});
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
		if (err) console.log(err);
		res.redirect('/user/' + userId);
	});
});

app.listen(process.env.PORT || 3000);
