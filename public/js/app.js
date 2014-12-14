var pollMeApp = angular.module('pollMeApp', ['ngResource'])
.controller('pollMeController', ['$scope', function($scope) {
	$scope.question = {
		hash: 'LIKE',
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
	debugger;

	//var Question = $resource('/user/:userId', {userId:'@id'}); //?
	/*    $scope.addTodo = function() {
	  $scope.todos.push({text:$scope.todoText, done:false});
	  $scope.todoText = '';
	};

	$scope.remaining = function() {
	  var count = 0;
	  angular.forEach($scope.todos, function(todo) {
		count += todo.done ? 0 : 1;
	  });
	  return count;
	};

	$scope.archive = function() {
	  var oldTodos = $scope.todos;
	  $scope.todos = [];
	  angular.forEach(oldTodos, function(todo) {
		if (!todo.done) $scope.todos.push(todo);
	  });
	};*/
	}]);
debugger;