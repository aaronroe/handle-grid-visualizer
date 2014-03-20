var handleVisApp = angular.module('handleVisApp', ['infinite-scroll']);

handleVisApp.controller('indexCtrl', function($scope, $http, $timeout) {
	// the records for the handles, which are {'name':, 'max_id'} dicts.
	$scope.handleRecords = [];

	// the list of tweets to be displayed.
	$scope.tweets = []

	// whether or not there are tweets loading.
	$scope.loading = false;

	// function when a handle is to be added.
	$scope.addHandleRecord = function() {
		// only add value that is new.
		if ($scope.handleInput != null && $scope.handleInput != "" && !handleAdded($scope.handleInput)) {
			$scope.handleRecords.push({"name":$scope.handleInput, "max_id":''});
			
			// clear the input.
			$scope.handleInput = "";

			// clear the stream of tweets.
			refreshTweets();
		}
	};

	// function when enter is pressed for the input box.
	$scope.enterPressed = function(keyPressed) {
		if (keyPressed.keyCode == 13 && $scope.handleInput != null && $scope.handleInput != "") {
			$scope.addHandleRecord();
		}
	};

	// function when a handle is to be removed.
	$scope.removeHandleRecord = function(index) {
		$scope.handleRecords.splice(index, 1);

		refreshTweets();
	};

	// adds more tweets to the page.
	$scope.loadMoreTweets = function() {
		$scope.loading = true;

    $http.get('tweets/' + encodeURIComponent(JSON.stringify($scope.handleRecords))).then(function(result) {
      	$scope.handleRecords = result.data.handle_records;
      	$scope.tweets.push.apply($scope.tweets, result.data.next_tweets);

      	$scope.loading = false;
    		
    		// check to see if the last element is still in the user viewport. If it is, load more elements.
    		$timeout(function() {
    			if (verge.inViewport($('#'+($scope.tweets.length-1).toString()))) {
    				$scope.loadMoreTweets();
    				}
    		});
    });
	};

	/**
	 * Helper function that refreshes the tweet stream from the beginning.
	 */
	function refreshTweets() {
		// clear tweets
		$scope.tweets = [];
		
		// reset all the handle records.
		for (var i = 0; i < $scope.handleRecords.length; i++) {
			$scope.handleRecords[i].max_id = '';
		}

		$scope.loadMoreTweets();
	}

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