/*
 * Handler of the Rest response
 * Send data to the client
 */
var logger = require('../logger.js');

var ESSearch = require('./essearch');
var conf = require('../conf/conf.json');

function RestHandler(pCollection) {

	// DAO layer for MongoDB
	var essearch = new ESSearch();
	
	var sendResponse = function(pErr, pData, pResult, pSuccessCode) {
		if (pErr) {
			pResult.respond(new Error('Technical error while processing es query' + pErr), 500);
			logger.getInstance().error('Technical error while processing es query' + pErr);
		}
		if (pData == null || pData.length <= 0) {
			pResult.respond(new Error('No data'), 404);
			//logger.getInstance().warn(pReq.route.path + ' : no data found ');
		} else {
			logger.getInstance().debug('restHandler.js : responding '+ pSuccessCode);
			pResult.respond(pData, pSuccessCode);
		}
	};

	var handletGetQuery = function(pApp, pPath, pESClient, pIndex, pQuery){
		var query = JSON.stringify(pQuery.esQuery);
		query = query.replace('"@', "req.params.");
		query = query.replace('@"', "");

		pApp.get(pPath, function(req, res, next) {
			logger.getInstance().debug('restHandler.js : setting contentType');

			res.contentType('application/json');
			
			logger.getInstance().debug('restHandler.js : contentType set ' + res.get('Content-Type'));
		
			var start = 0;
			var limit = 10;
			var successCode = 200;

			if (req.query.start) {
				start = req.query.start;
				// if "start" set, return 206 to mention "partial content"
				successCode = 206;
				logger.getInstance().debug('restHandler.js : start - sucess code set to '+ successCode);
			}
			if (req.query.limit) {
				// cast to int
				limit = parseInt(req.query.limit);
				// if "limit" set, return 206 to mention "partial content"
				successCode = 206;
				logger.getInstance().debug('restHandler.js : limit - sucess code set to '+ successCode);
			}

			logger.getInstance().debug('restHandler.js : query es find');

			essearch.esFind(pESClient, pIndex, eval('(' + query + ')'), start, limit, function(err, data){
					
				if (err){
					logger.getInstance().error(eval('('+query+')'));
					logger.getInstance().error(err);
				}
				if (data){
					var hits = data.hits.total;
					var facets = data.facets;
					var results = new Array();
					for (var i=0; i< data.hits.hits.length; i++){
						results[i] = data.hits.hits[i]._source; 
					}
				}
				var reponse = new Object();
				reponse.results = results;
				reponse.total = hits;
				reponse.facets = facets;

				sendResponse(err, reponse, res, successCode);
			});
			logger.getInstance().debug('restHandler.js : es find called !');
			return;
		});
	}

	/*
	 * Creates the association between a route and a es query 
	 * @param pApp The Express app that supports the mapping 
	 * @param pPath The route mapped to the es query 
	 * @param pQuery The es query as : 
	 * { 
	 * 	  "method":"find",
	 * 	  "returnAList":true,
	 *    "query": { 
	 *    }
	 * }
	 */
	this.mapPathToQuery = function(pApp, pPath, pESClient, pIndex, pQuery) {

		logger.getInstance().debug('restHandler.js : Mapping '+pPath);

		// Replace args "@arg@" by req.params.arg so as to let evaluation
		// possible. This operation requires the json object to be transform
		// to a string
		//
		// var queryObj = req.app.get(req.route.path).query;
		// var queryObj = pQuery.query;
		if (pQuery.method == "get"){
			handletGetQuery(pApp, pPath, pESClient, pIndex, pQuery);
		}else if (pQuery.method == "post"){
			pApp.post(pPath, function(req, res, next) {
				logger.getInstance().debug('post ...');
				res.contentType('application/json');

				var doc = {};
				doc.index = pIndex;
				doc.type = pQuery.type;
				doc.body = req.body;

				logger.getInstance().debug('Index le document : '+JSON.stringify(doc));

				essearch.esIndex(pESClient,pIndex, pQuery.type, req.body, function(err, data){
							sendResponse(err, data, res, 200);
						});
			});			
		}
		// TODO : trouver une manière générique de décrire une opération DELETE.
		// Idée : - Une qui ressemble à search mais pour delete => deleteByQuery
		//		  - Une qui fait du delete by id et qui doit forcément avoir un 
		//			paramètre "id" ?
		// 
		// else if (pQuery.method == "delete"){
		// 	pApp.delete(pPath, function(req, res, next) {
		// 		res.contentType('application/json');

		// 		var doc = {};
		// 		doc.index = pIndex;
		// 		doc.type = pQuery.type;
		// 		doc.body = req.body;

		// 		logger.getInstance().debug('Index le document : '+JSON.stringify(doc));

		// 		essearch.esDelete(pESClient,pIndex,pQuery.type,req.body.id, function(err, data){
		// 					sendResponse(err, data, res, 200);
		// 				});
		// 	});			
		// }
	};	
	
}

module.exports = RestHandler;