var pollMeApp = angular.module('pollMeApp', ['pollMeApp.services'])
	.controller('pollMeController', ['$scope', 'PollMeQuestionApi', function($scope, PollMeQuestionApi) {
		$scope.section = 'welcome';
		$scope.question = {
			hash: '',
			question: '',
			answers: { 
				positive: 'Yes',
				negative: 'No'
				},
			votes: {
				positive: 0,
				negative: 0
			},
			owner: ''
		};
		//debugger;
		
		$scope.getQuestion = function() {
			debugger;
			$scope.question = PollMeQuestionApi.get({hash: $scope.question.hash},
				function() {
					// Success, show answer question section
					$scope.section = 'answer';					
				}, function(response) {
					// Error, show error TODO: error handling
					switch(response.status) {
						case 404:
							console.warn('Error 404');
						break;
						case 500: 
							console.error(response);
						break;
						default:
							console.log('Some error', response);
					};
				});
		};
	
	
	}]);
	