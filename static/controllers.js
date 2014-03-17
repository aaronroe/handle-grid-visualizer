var handleVisApp = angular.module('handleVisApp', ['infinite-scroll']);

handleVisApp.controller('indexCtrl', function($scope, $http) {
	// the records for the handles, which are {'name':, 'max_id'} dicts.
	$scope.handleRecords = [];

	// the list of tweets to be displayed.
	$scope.tweets = []

	// function when a handle is to be added.
	$scope.addHandleRecord = function() {
		// only add value that is new.
		if ($scope.handleInput != null && $scope.handleInput != "" && !handleAdded($scope.handleInput)) {
			$scope.handleRecords.push({"name":$scope.handleInput, "max_id":''});
			
			// clear the input.
			$scope.handleInput = "";

			$scope.loadMoreTweets();
		}
	};

	// function when a handle is to be removed.
	$scope.removeHandleRecord = function(index) {
		$scope.handleRecords.splice(index, 1);
	};

	// adds more tweets to the page.
	$scope.loadMoreTweets = function() {
    $http.get('tweets/' + encodeURIComponent(JSON.stringify($scope.handleRecords))).then(function(result) {
      	$scope.handleRecords = result.data.handle_records;
      	$scope.tweets.push.apply($scope.tweets, result.data.next_tweets);
    });

    // var last = $scope.tweets[$scope.tweets.length - 1];
    // for(var i = 1; i <= 14; i++) {
    //   $scope.tweets.push(last + i);
    // }
	};

	/**
	 * Helper function that determines whether a handle has already been added to the list of handle records.
	 */
	function handleAdded(handleName) {
		for (var i = 0; i < $scope.handleRecords.length; i++) {
			if ($scope.handleRecords[i].name === handleName) {
				return true;
			}
		}
		return false;
	}
});