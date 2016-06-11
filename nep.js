var fortune = require('./lib/fortune.js');
var express = require('express');
var handlebars = require('express-handlebars')
	.create({
		defaultLayout: 'main',
		helpers: {
			section: function(name, options) {
				if (!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
		}
	});
var bodyParser = require('body-parser');
var credentials = require('./credentials')
var app = express();

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

var port = app.get('port');


// testing functionality
app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

// mocked weather data
function getWeatherData() {
	return {
		locations: [{
				name: 'Asuncion',
				forcastUrl: 'https://www.wunderground.com/global/stations/86218.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
				weather: 'Overcast',
				temp: '54.1 F (12.3 C)'
			},

			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',
			}, {
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)',
			},
		],
	};
}

// middleware
app.use(function(req, res, next) {
	if (!res.locals.partials) {
		res.locals.partials = {};
	}
	res.locals.partials.weatherContext = getWeatherData();
	next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

// routes
app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
	res.render('about', {
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river', function(req, res) {
	res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(req, res) {
	res.render('tours/oregon-coast');
});


app.get('/tours/request-group-rate', function(req, res) {
	res.render('tours/request-group-rate');
});

app.get('/headers', function(req, res) {
	res.set('Content-Type', 'text/plain');
	var s = '';
	for (var name in req.headers) s += name + ':' + req.headers[name] + '\n';
	res.send(s);
})

app.get('/nursery-rhyme', function(req, res) {
	res.render('nursery-rhyme');
});

app.get('/data/nursery-rhyme', function(req, res) {
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck'
	})
})

app.get('/jquery-test', function(req, res) {
	res.render('jquery-test');
});

app.get('/newsletter', function(req, res) {
	res.render('newsletter', {
		csrf: 'CSRF token goes here'
	});
});


app.post('/process', function(req, res){
	if(req.xhr || req.accepts('json,html')==='json'){
	// if there were an error, we would send { error: 'error description' }
		res.send({ success: true });
	} else {
// if there were an error, we would redirect to an error page
	res.redirect(303, '/thank-you');
	}
});

// 404 catch-all handler (middleware)
app.use(function(req, res) {
	res.status(404);
	res.render(404);
});

// 500 error handler (middleware)
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});



app.listen(app.get('port'), function() {
	console.log('express started on localhost:' + app.get('port') + ' press CTRL-C to terminate');
});