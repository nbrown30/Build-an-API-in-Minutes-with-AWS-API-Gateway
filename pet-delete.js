'use strict';
const AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-2' });

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    console.log('entered get-pet with id ' + event.pathParameters.id);

    var params = {
        TableName: 'Pets',
        Key: {
            Id: event.pathParameters.id
        }
    };

    // Call DynamoDB to read the item from the table
    documentClient.delete(params, function(err, data) {
        var response;
        
        if (err) {
            console.error({
                input: event,
                err: err
            });
            response = {
                statusCode: 500,
                body: 'Failed to get item: ' + err
            };
        } else {
            console.log(JSON.stringify(data));
            response = {
                statusCode: 204,
                body: JSON.stringify(data)
            };
        }

        callback(null, response);
    });
};
