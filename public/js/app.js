var pollMeApp = angular.module('pollMeApp', ['pollMeApp.services', 'ngCookies'])
	.controller('pollMeController', ['$scope', 'PollMeQuestionApi', '$cookies', function($scope, PollMeQuestionApi, $cookies) {
		//debugger;
		
		$scope.gotoStart = function() {
			$scope.section = 'welcome';
			$scope.question = {
				hash: '',
				question: '',
				answers: { 
					positive: 'Yes',
					negative: 'No'
					},
				votes: {
//					total: 0,
					positive: 0,
					negative: 0
				},
				owner: ''
			};
		};
		
		$scope.getQuestion = function() {
			if ($scope.question.hash == '') {
				return;
			}
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
				}
			);
		};
	
		$scope.createQuestion = function() {
			$cookies.myQuestion = '';
			$scope.section = 'ask';
		};
		
		$scope.addQuestion = function() {
			if ($scope.question.question == '' ||  $scope.question.hash == ''  ||  $scope.question.owner == '') {
				// TODO nice validation
				return; 
			}
			var newQuestion = new PollMeQuestionApi($scope.question);
			newQuestion.$save(function(result) {
				console.log(result);
				if (result.success) {
					$scope.question = result.result;
					$cookies.myQuestion = $scope.question.hash;
					$scope.showResult();
				}
			});
		};
		
		$scope.showResult = function() {
			if (!$scope.question || !$scope.question.hash || $scope.question.hash == '') {
				if ($cookies && $cookies.myQuestion && $cookies.myQuestion != '') {
					$scope.question = PollMeQuestionApi.get({hash: $cookies.myQuestion},
						function() {
							// Success, show results section
							calculateVotes();
							$scope.section = 'result';				
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
						}
					);
				} else {
					$scope.gotoStart();
					return;
				}
			} else {
				calculateVotes();
				$scope.section = 'result';
			}
		};
		
		$scope.voteQuestion = function(vote) {
			//$scope.question.$update();
			var updatedQuestion = PollMeQuestionApi.updateVotes({hash: $scope.question.hash}, {vote: vote}, 
				function() {
					//console.log(updatedQuestion.question);
					$scope.question = angular.extend({}, $scope.question, updatedQuestion.question);
					//console.log($scope.question);
					calculateVotes();
					$scope.section = 'votes';
					//debugger;			
				}, function(response) {
					debugger;
				}
			);
			//debugger;
		};
		
		var calculateVotes = function() {
			var total = $scope.question.votes.positive + $scope.question.votes.negative,
				positivePerc = ($scope.question.votes.positive / total) * 100 || 50,
				negativePerc = ($scope.question.votes.negative / total) * 100 || 50;
			$scope.question.votes.total = total;
			$scope.question.votes.positivePerc = Math.round(positivePerc);
			$scope.question.votes.negativePerc = Math.round(negativePerc);
		};
	
		//$scope.gotoStart();
		$scope.showResult();
	}]);
	
