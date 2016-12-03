'use strict';

var db = require('../db').db;

function get(field, value, limit = 10, sort = 1) {
	var collection = db.get('ProductsCollection');

	var filterObject = Object.assign({}, field && value && {[field]: value});
	var sortsObject = field ? {"sort" : {[field] : sort}} : false;
	var limitObject = {"limit": limit};
	
	return new Promise((resolve, reject) => {
		collection.find(filterObject, Object.assign(limitObject, sortsObject), function(err, docs) {
	    		if(err) { 
	    			reject(err);
	    		}

	    		resolve(docs);
	    });
	});
}

function getProducts(filter, fields)
{
	var collection = db.get('ProductsCollection');
	console.log(fields);
	return new Promise((resolve, reject) => {
		collection.find(filter, fields, function(err, docs) {
			
	    		if(err) { 
	    			reject(err);
	    		}
	    		var ret = {};
	    		ret.filter = filter;
	    		ret.products = docs;// Object.assign({}, docs);
	    		//console.log(ret);
	    		resolve(ret);
	    });
	});
}

function insert(user)
{
    var collection = db.get('ProductsCollection');
    
    return new Promise((resolve, reject) => {
    	    collection.insert(user, function(err, doc){
		      	if(err) { 
			    	reject(err);
			    }

			    resolve(docs);
		    });
    });
}

function update(user)
{
    var collection = db.get('ProductsCollection');
    
    return new Promise((resolve, reject) => {
	    collection.update({_id : user._id}, user, function(err, doc){
	    	console.log("err = ", err);
	    	console.log("doc = ", doc);

	    	/*if(err) { 
			    	reject(err);
			    }

			    resolve(docs);*/
	    });
}	);
}

module.exports = {
	get, insert, update, getProducts
};