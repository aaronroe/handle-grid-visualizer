var handleVisApp = angular.module('handleVisApp', ['infinite-scroll'], function($locationProvider) {
  $locationProvider.html5Mode(true);
});

handleVisApp.controller('indexCtrl', function($scope, $http, $timeout, $location) {
  // the records for the handles, which are {'name':, 'max_id'} dicts.
  $scope.handleRecords = [];

  // the list of tweets to be displayed.
  $scope.tweets = []

  // whether or not there are tweets loading.
  $scope.loading = false;

  // whether or not an error is to be displayed.
  $scope.error = false;

  // if there are GET params, init with them.
  initWithGETParams();

  // function when a handle is to be added.
  $scope.addHandleRecord = function() {
    // only add value that is new.
    if ($scope.handleInput != null && $scope.handleInput != "" && !handleAdded($scope.handleInput)) {
      $scope.handleRecords.push({"name":$scope.handleInput, "max_id":""});
      
      addToGETParams($scope.handleInput);
      
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
    removeFromGETParams($scope.handleRecords[index]);

    $scope.handleRecords.splice(index, 1);

    refreshTweets();
  };

  // a watch over the handle input. If the user starts typing, remove the error message.
  $scope.$watch('handleInput', function(newVal){
    $scope.error = false;
  });

  // adds more tweets to the page.
  $scope.loadMoreTweets = function() {
    $scope.loading = true;

    $http.get('tweets/' + encodeURIComponent(JSON.stringify($scope.handleRecords))).then(function(result) {
        $scope.handleRecords = result.data.handle_records;
        $scope.tweets.push.apply($scope.tweets, result.data.next_tweets);

        $scope.loading = false;
        
        // check to see if the last element is still in the user viewport. If it is, load more elements.
        $timeout(function() {
          if (result.data.next_tweets.length !== 0 && verge.inViewport($('#'+($scope.tweets.length-1).toString()))) {
            $scope.loadMoreTweets();
          }
        });
    });
  };

  /**
   * Initializes data with GET parameters.
   */
  function initWithGETParams() {
    try {
      var handles = JSON.parse($location.search().handles);
      for (var i = 0; i < handles.length; i++) {
        $scope.handleRecords.push({"name": handles[i], "max_id": ""});
      }

      refreshTweets();
    }
    catch(e) {
      console.log('Invalid handle record specified in the URL');
    }
  }

  /**
   * Adds a handle to the list of handles in the URL.
   */
  function addToGETParams(handleName) {
    try {
      var handles = JSON.parse($location.search().handles);
      
      handles.push(handleName);
      var handlesString = JSON.stringify(handles);
      $location.search({"handles": handlesString});
    }
    catch(e) {
      console.log('Invalid handle record specified in the URL');
      $location.search({"handles": "["+"\""+handleName+"\""+"]"});  
    }
  }

  /**
   * Removes a handle from the list of handles in the URL.
   */
  function removeFromGETParams(handle) {
    try {
      var handles = JSON.parse($location.search().handles);
      
      var indexToRemove = handles.indexOf(handle.name);
      if (indexToRemove > -1) {
        handles.splice(indexToRemove, 1);
      }

      var handlesString = JSON.stringify(handles);
      $location.search({"handles": handlesString});
    }
    catch(e) {
      console.log('Invalid handle record specified in the URL');
    }
  }

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
      if ($scope.handleRecords[i].name.toLowerCase() === handleName.toLowerCase()) {
        // if the handle has been added, show the error.
        $scope.error = true;

        return true;
      }
    }
    return false;
  }
});