
# Build an API in Minutes with AWS API Gateway

## Upload Items to DynamoDb
Use the aws cli to bulk upload data to your database (this is not possible through the console).
```bash
aws dynamodb batch-write-item --request-items file://dynamo-db-batchputitem.json
```

## Notes on Design
- Do not use single digits or auto-number IDs in DynamoDB. There's no built in mechanism for them and counting the number of records is costly. Use UUIDs instead.
- Consolidate PUT and POST code.
- I had issues with the Node 10.x runtime, Lambda wouldn't include npm packages as expected. So for now I'm using the 8.10 runtime.
- Use the DynamoDB DocumentClient class to simplify getting and putting items into the DB. If you don't use the client it's necessary to include additional properties in your JSON that specify the data types being used in the data.

## AWS SDK NodeJS Reference

* [getItem](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property)
* [putItem](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property)

### [DocumentClient](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html)

* [get](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#get-property)
* [put](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property)
* [query](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property)
* [scan](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property)


