var config = require('./config'),
	express = require('express'),
	bodyParser = require('body-parser'),
	mongo = require('mongo'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	app = express();

// Connect to the database
mongoose.connect(config.credentials.mongodb_connection);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var questionSchema = new Schema({
	hash: String, // e.g. COOLNODE
	question: String, // e.g. 'Is Node.js cool stuff'?
	answers: { 
		positive: {type: String, default: 'Yes'}, 
		negative: {type: String, default: 'No'}
	},
	votes: {
		positive: Number, // e.g. 60,
		negative: Number  // e.g. 40
	},
	owner: String, // e.g. 'John Doe'
	dateAdded: {type: Date, default: Date.now},
	pollEnded: {type: Boolean, default: false} // when true voting stopped.
});
//questionSchema.methods.vote = function() {
//	
//};
var Question = mongoose.model('Question', questionSchema);

// Query the database on the hash
var getQuestionPromise = function(cleaned_hash) {
	if (!cleaned_hash) return;
	var query = Question.where({hash: cleaned_hash}),
		promise = query.findOne().exec();
	return promise;
};

// 
app.use('/public', express.static('public'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

/*
	get  '/': FE shows front page
	get  '/question/:hash': gets question json, FE shows answer page (voter)
	put  '/question/:hash/vote/{vote}': sends answer, gets results json, FE shows current results page (voter)
	post '/question/{form values}': sends question, gets ok, FE shows share page (asker)
	get  '/question/:hash/votes/': gets results json, FE shows results page (asker)
	
	TODO: later: end question
*/

var router = express.Router();
router.param('hash', function(req, res, next, id) {
	// Get the question based on the hash, (TODO: clean it and) put it to uppercase
	var cleaned_hash = id.toUpperCase();
	//console.log('cleaned hash = '+cleaned_hash);
	
	// Create a promise for the question from the DB
	req.promiseQuestion = getQuestionPromise(cleaned_hash);
	
	next();
});
router.route('/question/:hash?')
	.all(function(req, res, next) {
		// default logic for all, it does some logging...
		console.log(req.method + ' ' + req.originalUrl + ' matched by ' + req.route.path + ' with hash: ' + req.params.hash);
		if (req.method == 'POST') {
			console.log(req.body);
		}
		next();
	})
	.get(function(req, res, next) {
		// e.g. GET /question/coolnode
		if(req.promiseQuestion) {
			req.promiseQuestion.then(function(question) {
				// Returns question JSON
				res.json(question.toObject());
			}).then(function(error) { // error
				throw new Error(error + ' is an error!');
			});		
		} else {
			throw new Error('No hash found!');
			//res.end();
		}
	})
	.put(function(req, res, next) {
		next(new Error('not implemented'));
	})
	.post(function(req, res, next) {
		// POST /question
		// Create a new question from the form values
		var new_question = new Question({
			hash: req.body.hash,
			question: req.body.question,
			owner: req.body.owner
		});
		// Save question to DB
		new_question.save(function(error, question) {
			console.log(question);
			var status = {
				success: true,
				result: question
			};
			if (error) {
				status.success = false;
				throw new Error(error + ' is an error!');
			}
			// Returns status JSON
			res.json(status);
		});
	})
	.delete(function(req, res, next) {
		next(new Error('not implemented'));
	});
// TODO: votes logic
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
	// TODO: serve angular based index.html
	res.send('Hello World!');
});

var server = app.listen(process.env.PORT || 8076, function () {
	var //host = server.address().address,
		port = server.address().port,
		node_env = process.env.NODE_ENV || 'development';
		//console.log(server.address());
		//console.log('PollMe app listening at http://%s:%s', host, port);
		console.log('* Poll Me app (%s) running and listening on port %s', node_env, port);
});
