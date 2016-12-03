var express = require('express');
var router = express.Router();
var products = require('../models/products');
var ObjectID = require('../db').ObjectID;

var validFields = ["price", "shipping", "sku", "title", "brand", "store_id"];
/*
 * GET productList.
 */
router.get('/', function(req, res) {
    var sort = req.query.sort;
    var field = req.query.field;
    var value = req.query.value;
    var limit = req.query.limit;

    //validations
    if(field){
        // Check that the field exists
        req.checkQuery('field', "The field '" + field + "' does not exist.").containsField();
        
        // Check that the value is valid
        req.checkQuery('value', "The value " + value + 
                            " is not valid for the field " + field).isValidValueForField(field);
        
        // Check that the sort is  valid
        req.checkQuery('sort', "sort should be either 1 or -1. The input was " + sort).isValidSort();
    }

    // Check the limit
    if(limit){
        req.checkQuery('limit', "limit must be a possitive number. The input was " + limit).isPosInt();
    }

    var errors = req.validationErrors();

    if (errors) {
        res.json({ errors: errors });
    }

    // Create the fields
    if(field == "price"){
        value = parseFloat(value);
    }
    if(sort){
        sort = Number(sort);
    }
    if(limit){
        limit = Number(limit);
    }

    products.get(field, value, limit, sort)
    .then(result => res.json(result))
    .catch(err => res.send(err));
});

/*
 * POST to update a product.
 */
router.post('/updateProduct', function(req, res) {
    var product = createProduct(req.body);

    products.update(product).
    then(result => res.send(result))
    .catch(err => res.send(err));
});

/*
 * POST to add a product.
 */
router.post('/addProduct', function(req, res) {
    var product = createProduct(req.body);

    products.insert(product).
    then(result => res.send(result))
    .catch(err => res.send(err));
});

function createProduct(prod)
{
    var retVal = Object.assign({}, prod);

    if(prod._id){
        retVal._id = new ObjectID(prod._id);
    }

    retVal.price = parseFloat(prod.price);
    retVal.store_id = new ObjectID(prod.store_id); 
    
    return retVal;
}

module.exports = router;
