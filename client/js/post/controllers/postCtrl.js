Elastweet.controller('postCtrl', function($scope,$timeout, elastweetApi){
	$scope.tweet = {}
	$scope.tweet.message = "couocu";
	// $scope.texte = elastweetApi.getData(function(pData){ return pData; });
	$scope.sendTweet = function(){
		console.log($scope.tweet.message);
		elastweetApi.sendMessage('fabio', $scope.tweet.message,$scope.postOk);
		$scope.tweet.message="Type your message";
	}
	$scope.postOk = function(pData){
		$scope.tweetOk = 'Ok';
		$timeout(function() {
			$scope.tweetOk = '';
		}, 1000);
	}
});