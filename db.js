'use strict';

// MongoDB variables 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/Excersize');
var ObjectID = mongo.ObjectID;

module.exports = {db, ObjectID};