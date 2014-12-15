angular.module('pollMeApp.services', ['ngResource'])
.factory('PollMeQuestionApi', function($resource) {
	return $resource('http://127.0.0.1:8076/question/:hash', {hash: '@_hash'}, {

	});
});