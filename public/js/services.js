angular.module('pollMeApp.services', []).factory('PollMe', function($resource) {
	return $resource('http://127.0.0.1:8076/question/:hash', {hash: '@_hash'}, {
		add: {
			method: 'POST'
		}
	});
});