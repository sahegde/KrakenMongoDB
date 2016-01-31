'use strict';

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var async = require('async');

/*
	Collection that i am going to insert
	[
		{
			"name" : "sandeep",
			"profession" : "engineer"
		},
		{
			"name" : "pradeep",
			"profession" : "engineer"
		},
		{
			"name" : "sumana",
			"profession" : "bsnl"
		},
		{
			"name" : "lakshmisha",
			"profession" : "railways"
		}
	]

*/

var familyModel = 	[
		{
			"name" : "sandeep",
			"profession" : "engineer"
		},
		{
			"name" : "pradeep",
			"profession" : "engineer"
		},
		{
			"name" : "sumana",
			"profession" : "bsnl"
		},
		{
			"name" : "lakshmisha",
			"profession" : "railways"
		}
	];

function insertIntoDB(db,next) {
	var col = db.collection('family');
	col.insertMany(familyModel, function(err, res) {
		if(err) {
			console.log("Error while inserting data into db "+err);
			return next(err);
		}else {
			console.log("Response after inserting data into db "+JSON.stringify(res));
			return next(null,res);
		}
  	});
}

function findFromDB(db,next) {
	var family = db.collection('family').find( );
	var membersData = [];
	family.each(function(err, member) {
		if(err) {
			return next(err);
		}
		if(member != null) {
			console.log("Details of member "+JSON.stringify(member));
			membersData.push(member);
		}else {
			return next(null,membersData);
		}
	});
}

function initializeConnection(next) {
	var url = 'mongodb://localhost:27017/test';
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log("Connected correctly to server.");
	  return next(db);
	});
}

function deleteAllData(db,next) {
	db.collection('family').deleteMany({},function(err,results) {
		console.log("Response from delete operation is "+JSON.stringify(results));
		return next(err);
	});
}

module.exports = function IndexModel(callback) {
	var dbConnection = null;
	async.series({
		"initialize" : function(next) {
			initializeConnection(function(db) {
				dbConnection = db;
				console.log("Initialization of db done");
				return next();
			});
		},
		"deleteData" : function(next) {
			deleteAllData(dbConnection,function(err) {
				return next(err);
			});
		},
		"insert" : function(next) {
			insertIntoDB(dbConnection,function(err) {
				return next(err);
			});
		},
		"display" : function(next) {
			findFromDB(dbConnection,function(err,data) {
				return next(err,data);
			});
		}
	},function(err,result) {
		if(err) {
			console.log("There is an error "+err);
		}else {
			console.log("Result is "+JSON.stringify(result));
		}
		dbConnection.close();
		return callback(result);
	});
};
