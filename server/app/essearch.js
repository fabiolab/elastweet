var logger = require('../logger.js');

function ESSearch() {
	"use strict";

	/*
	 * If this constructor is called without the "new" operator, "this" points
	 * to the global object. Log a warning and call it correctly.
	 */
	if (false === (this instanceof ESSearch)) {
		logger.getInstance().warn('ESSearch constructor called without "new" operator');
		return new ESSearch();
	}

	/*
	 * Call a search method to ES and sends the data to the client
	 * @param pESClient ES Client
	 * @param pQuery ES find query
	 * @param pStart Number of the page of the result
	 * @param pLimit Number of element per page
	 * @param pCallback Callback to run after to process the es find result 
	 */
	this.esFind = function(pESClient, pIndex, pQuery, pStart, pLimit, pCallback) {
		logger.getInstance().debug('essearch.js : find query ...');
		var doc = pQuery;
		doc.index = pIndex;

		pESClient.search(doc,pCallback);
		logger.getInstance().debug('essearch.js : find query called !');
	};

	this.esIndex = function(pESClient, pIndex, pType, pData, pCallback) {
		logger.getInstance().debug('essearch.js : indexing ...');
		var doc = {};
		doc.index = pIndex;
		doc.type = pType;
		doc.body = pData;
		pESClient.index(doc,pCallback);
		logger.getInstance().debug('essearch.js : indexing done !');
	};

	this.esDelete = function(pESClient, pIndex, pType, pId, pCallback) {
		logger.getInstance().debug('essearch.js : deleting ...');
		var doc = {};
		doc.index = pIndex;
		doc.type = pType;
		doc.id = pId;
		pESClient.delete(doc,pCallback);
		logger.getInstance().debug('essearch.js : deleting done !');
	};

	
}

module.exports = ESSearch;
