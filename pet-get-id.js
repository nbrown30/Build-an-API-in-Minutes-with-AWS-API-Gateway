'use strict';
const AWS = require('aws-sdk');
// Set the region
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
const documentClient  = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    console.log('entered get-pet with id ' + event.pathParameters.id);
    console.log('entered get-pet with pathParameters ' + JSON.stringify(event.pathParameters));

    var params = {
      TableName: 'Pets',
      Key: {
        Id: event.pathParameters.id
      }
    //   ProjectionExpression: 'Name, Breed, Species, Image'
    };
    console.log(params);

    // Call DynamoDB to read the item from the table
    documentClient.get(params, function(err, data) {
      if (err) {
        console.error({
          input: event,
          err: err
        });
        return {
            statusCode: 500,
            body: 'Failed to get item: ' + err
        };
      } else {
        console.log(JSON.stringify(data));
        var response = {
            statusCode: 200,
            body: JSON.stringify(data.Item)
        };
        context.succeed(response);
        return response;
      }
    });
};