var express = require('express'),
    exphbs  = require('express3-handlebars'),
    user_db = require('./user_db.js')
	app = express();

//app.use(express.static(__dirname + '/public'));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
	res.render('home', {title: "hello"});
});

app.get('/register', function(req, res){
	var user = {
		name: "Colin",
	 	email: "colinjameswebb@hotmail.com",
	 	password: "password1"
	};
	user_db.createUser(user, function(err, res){
		res.render('home', {title: res});
	});
});

app.listen(process.env.PORT || 3000);
