var express = require('express'),
	bodyParser = require('body-parser'),
	mongo = require("mongo"),
	mongoose = require("mongoose"),
	app = express();

var db = mongoose.createConnection(
  'mongodb://pollme:p0llM3@proximus.modulusmongo.net:27017/viQ9uwod'
);

// 
app.use('/public', express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

/*
	get  '/': show front page
	get  '/question/:hash': gets question json, show answer page (voter)
	put  '/question/:hash/vote/{vote}': sends answer, gets results json, show current results page (voter)
	post '/question/{form values}': sends question, gets ok, show share page (asker)
	get  '/question/:hash/votes/': gets results json, show results page (asker)
	
	later: end question
*/

var router = express.Router();
router.param('hash', function(req, res, next, id) {
	// sample question, would actually fetch from DB, etc...
	req.question = {
		hash: id,
		question: 'Do you like this',
		answers: { 
			positive: 'Yes',
			negative: 'No'
		},
		votes: {
			positive: 60,
			negative: 40
		},
		owner: 'John Doe'
	};
	next();
});
router.route('/question/:hash?')
	.all(function(req, res, next) {
		// default logic for all
		console.log('/question/ hash=' + req.params.hash);
		next();
	})
	.get(function(req, res, next) {
		console.log('GET');
		console.log(req.params);
		res.json(req.question);
	})
	.put(function(req, res, next) {
		next(new Error('not implemented'));
	})
	.post(function(req, res, next) {
		console.log('POST');
		console.log(req.body);
		
		// inserting the question
		req.question = {};
		req.question.hash = req.body.hash;
		req.question.question = req.body.question;
		req.question.owner = req.body.owner;
		// save question ... etc
		
		res.json(req.question);
		//next();
	})
	.delete(function(req, res, next) {
		next(new Error('not implemented'));
	});
router.route('/question/:hash/votes?')
	.all(function(req, res, next) {
		// default logic for all
		console.log('/question/vote(s) hash=' + req.params.hash);
		next();
	})
	.get(function(req, res, next) {
		//console.log(req);
		res.json(req.question);
	})
	.put(function(req, res, next) {
		// update question with 1 vote
		res.json(req.question);
	})
	.post(function(req, res, next) {
		next(new Error('not implemented'));
	})
	.delete(function(req, res, next) {
		next(new Error('not implemented'));
	});
app.use(router);

app.get('/', function(req, res) {
	console.log('Request received: ' + req.url);
	res.send('Hello World!');
});

var server = app.listen(process.env.PORT || 8076, function () {
	var host = server.address().address,
		port = server.address().port;
		console.log(server.address());
		console.log('PollMe app listening at http://%s:%s', host, port);
});
