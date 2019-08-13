// Load the SDK for JavaScript
var AWS = require('aws-sdk');
const uuid = require('uuid');
// Set the region
AWS.config.update({ region: 'us-east-2' });
//Leverage the DocumentClient so we don't need to worry about DynamoDB data types in input and output
const documentClient = new AWS.DynamoDB.DocumentClient();
var isPut = false;

exports.handler = (event, context, callback) => {
    console.log('entered handler with ' + JSON.stringify(event));
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    var body = JSON.parse(event.body);
    isPut = (event.httpMethod === 'PUT');
    var id;

    if (!isPut) {
        id = uuid.v1();
    }
    else {
        id = body.Id;
    }

    var params = {
        TableName: 'Pets',
        Item: {
            Id: id,
            Name: body.Name,
            Breed: body.Breed,
            Species: body.Species
        },
    };

    if (isPut) {
        params.ConditionExpression = 'attribute_exists(Id)';
    }

    console.log('params = ' + params);

    //Call DynamoDB to add the item to the table
    documentClient.put(params, function(err, data) {
        var response;
        if (err) {
            response = getErrorResponse(event, err);
        }
        else {
            response = getSuccessResponse(params.Item);
        }

        callback(null, response);
    });
};


function getSuccessResponse(data) {
    var response = {
        statusCode: (isPut ? 200 : 201),
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

    if (err.code === 'ConditionalCheckFailedException') {
        response.statusCode = 400;
    }

    return response;
}