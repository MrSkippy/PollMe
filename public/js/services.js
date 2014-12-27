angular.module('pollMeApp.services', ['ngResource'])
	.factory('PollMeQuestionApi', function($resource) {
		return $resource('/question/:hash', {hash: '@hash'}, {
			'update': {method: 'PUT'},
			'updateVotes': {method: 'PUT', url: '/question/:hash/vote'}
		});
	});