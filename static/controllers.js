var handleVisApp = angular.module('handleVisApp', ['infinite-scroll']);

handleVisApp.controller('indexCtrl', function($scope) {
	// the list of handles to be processed.
	$scope.handleList = []

	// the list of tweets to be displayed.
	$scope.tweets = [1]

	// function when a handle is to be added.
	$scope.addHandle = function() {
		// only add value that is new.
		if ($scope.handleInput != null && $scope.handleInput != "" && $.inArray($scope.handleInput, $scope.handleList) == -1) {
			$scope.handleList.push($scope.handleInput)
			
			// clear the input.
			$scope.handleInput = "";
		}
	};

	// function when a handle is to be removed.
	$scope.removeHandle = function(index) {
		$scope.handleList.splice(index, 1);
	};

	// adds more tweets to the page.
	$scope.loadMoreTweets = function() {
    var last = $scope.tweets[$scope.tweets.length - 1];
    for(var i = 1; i <= 14; i++) {
      $scope.tweets.push(last + i);
    }
	};
});