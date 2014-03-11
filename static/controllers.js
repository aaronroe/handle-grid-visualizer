var handleVisApp = angular.module('handleVisApp', []);

handleVisApp.controller('indexCtrl', function($scope) {
	// the list of handles to be processed.
	$scope.handleList = []

	// function when a handle is to be added.
	$scope.addHandle = function() {
		// only add value that is new.
		if ($.inArray($scope.handleInput, $scope.handleList) == -1) {
			$scope.handleList.push($scope.handleInput)
			
			// clear the input.
			$scope.handleInput = "";
		}
	};

	// function when a handle is to be removed.
	$scope.removeHandle = function(index) {
		$scope.handleList.splice(index, 1);
	};
});