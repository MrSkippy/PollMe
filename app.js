var express = require('express'),
	app = express();

app.use('/public', express.static('public'));

/*
	get '/': show front page
	get '/question/:hash': gets question json, show answer page (voter)
	put '/vote/:hash,{vote}': sends answer, gets results json, show current results page (voter)
	put '/question/,{form}': sends question, gets ok, show share page (asker)
	get '/votes/:hash': gets results json, show results page (asker)
	
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
	owner: 'John Doe'
  };
  next();
});
router.route('/question/:hash')
.all(function(req, res, next) {
	// default logic for all
	console.log('/question/ ' + req.params.hash);
})
.get(function(req, res, next) {
	res.json(req.question);
})
.put(function(req, res, next) {
	next(new Error('not implemented'));
})
.post(function(req, res, next) {
	// inserting the question
	req.question.hash = req.params.hash;
	req.question.question = req.params.question;
	// save question ... etc
	res.json(req.question);
})
.delete(function(req, res, next) {
	next(new Error('not implemented'));
});
app.use(router);

app.get('/', function(req, res) {
	console.log('Request received: ' + req.url);
	res.send('Hello World!');
});

var server = app.listen(process.env.PORT, function () {
	var host = server.address().address,
		port = server.address().port;
		console.log('PollMe app listening at http://%s:%s', host, port);
});
