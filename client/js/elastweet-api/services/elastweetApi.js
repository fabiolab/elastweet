/*
 * This service allows to use the elastweet API
 * - Get messages from a list of users
 * - Post message
 */

Elastweet.service("elastweetApi", function($http){
	
	/*
	 * Get messages from a user
	 */
	this.getUserMessages = function(pUser, pSuccessCallback) {
	    $http.get('http://127.0.0.1:8070/api-restES-1/getMessagesByUser/'+pUser)
	    	.success(function(data){
	        	pSuccessCallback(data);
	    	}).error(function(data, status, headers, config) {
	        	console.log(headers);
	        	console.log(config);
	    	});
	}

	/*
	 * Get messages from a lisf of users
	 */
	this.getUserListMessages = function(pUserList, pSuccessCallback) {
	}

	/*
	 * Get a user profile
	 */
	this.getUserProfile = function(pUser, pSuccessCallback) {
	}

	/*
	 * Update a user profile
	 */
	this.updateUserProfile = function(pUser, pProfile, pSuccessCallback) {
	}

	/*
	 * Subscribe to a user feed
	 */
	this.subscribeUserFeed = function(pUser, pUserFeed, pSuccessCallback) {
	}

	/*
	 * Get messages from a user
	 */
	this.unsubscribeUserFeed = function(pUser, pUserFeed, pSuccessCallback) {
	}

	/*
	 * Post a message
	 */
	this.sendMessage = function(pUser, pMessage, pSuccessCallback){
		var message = {'user':pUser, 'message':pMessage}
		$http.post('http://localhost:8070/api-restES-1/sendMessage',  message)
			.success(function(data){
	        	console.log("Ok !");
	        	pSuccessCallback(data);
	    	}).error(function(data, status, headers, config) {
	    		console.log('eh ben non ...');
	    	});
	}

	/*
	 * Delete a message
	 */
	this.deleteMessage = function(pMessageId, pSuccessCallback) {
	}
});
