'use strict';

var db = require('../db').db;
var products = require('./products');
var ObjectID = require('../db').ObjectID;

function get()
{
	var collection = db.get('StoresCollecion');
	var listen = 0;
	return new Promise((resolve, reject) => {
		collection.find({}, {}, function(err, docs) {
			if(err) { 
				reject(err);
			}

			var listen = docs.length;
			var stores = [];

			docs.forEach(function(store){
				var storeFilter = {"store_id" : new ObjectID(store._id)};
				var fieldFilter = {price : 1};
				
				products.getProducts(storeFilter, fieldFilter).
			    then(result => {
			    	// Todo get max
			    	var min = Number.MAX_VALUE;
			    	var max = 0
			    	var sum = 0;

		    		result.products.forEach(function(product){
			    		var productPrice = parseFloat(product.price);
			    		min = productPrice < min ? productPrice : min;
			    		max = productPrice > max ? productPrice : max;
			    		sum += productPrice;	
			    	});

			    	var length = Object.keys(result.products).length;

			    	stores.push({
			    		store_id : result.filter.store_id,
			    		count : length,
			    		min : min,
			    		max : max,
			    		avg : sum / length
			    	});

			    	listen--;

			    	if(listen == 0)
			    	{
			    		resolve(stores);
			    	}
			    })
			    .catch(err => reject(err));
			});
		 });
	});
}

module.exports = {
	get
};