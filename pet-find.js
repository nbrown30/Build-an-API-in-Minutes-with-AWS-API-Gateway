'use strict';
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-2' });

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    console.log('entered get-pet with queryStringParameters ' + JSON.stringify(event.queryStringParameters));
    var searchName = event.queryStringParameters.name;
    var speciesName = event.queryStringParameters.species;

    if (searchName) {
        scanForPetByName(searchName, event, callback);
    }
    else {
        queryForPetsBySpecies(speciesName, event, callback);
    }
};

function scanForPetByName(searchName, event, callback) {
    let params = {
        TableName: 'Pets',
        FilterExpression: '#n = :searchName',
        ExpressionAttributeNames: {
            '#n': 'Name'
        },
        ExpressionAttributeValues: {
            ':searchName': searchName
        }
    };
    console.log(params);

    // Call DynamoDB to read the item from the table
    documentClient.scan(params, function(err, data) {
        var response;
        if (err) {
            response = getErrorResponse(event, err)
        }
        else {
            response = getSuccessResponse(data.Items);
        }

        callback(null, response);
    });
}

function queryForPetsBySpecies(speciesName, event, callback) {
    let params = {
        TableName: 'Pets',
        IndexName: 'Species-Breed-index',
        KeyConditionExpression: 'Species = :speciesName',
        ExpressionAttributeValues: {
            ":speciesName": speciesName
        }
    };

    documentClient.query(params, function(err, data) {
        var response;
        if (err) {
            response = getErrorResponse(event, err)
        }
        else {
            response = getSuccessResponse(data);
        }

        callback(null, response);
    });
}

function getSuccessResponse(data) {
    var response = {
        statusCode: 200,
        body: JSON.stringify(data)
    };

    return response;
}

function getErrorResponse(input, err) {
    console.error({
        input: input,
        err: err
    });

    var response = {
        statusCode: 500,
        body: JSON.stringify({
            message: err,
            input: input
        })
    };


    return response;
}
