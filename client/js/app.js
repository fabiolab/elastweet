var Elastweet = angular.module('elastweet', ['elasticjs.service', 'elasticsearch','ui.bootstrap']);

Elastweet.config(['$httpProvider', function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
	console.log("config http ok");
}]);
