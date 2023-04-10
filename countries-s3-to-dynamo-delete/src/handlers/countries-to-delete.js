const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  region: 'us-east-1'
});
const dynamo = new AWS.DynamoDB();

/**
 * A Lambda function that logs the payload received from S3.
 */
exports.s3JsonLoggerHandler = async (event, context) => {
  // All log statements are written to CloudWatch by default. For more information, see
  // https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-logging.html
  const getObjectRequests = event.Records.map(async record => {
    const params = {
      Bucket: record.s3.bucket.name,
      Key: record.s3.object.key
    };

    let s3Response;

    try {
      s3Request = s3.getObject(params);
      s3Request.on('complete', function(response) {
        s3Response = response;
        console.log("Inside handler about to log s3 response");
        console.log(s3Response);
      })
      s3Request.send();
    } catch (err) {
      console.error("Error calling S3 getObject:", err);
      s3Response = err;
    } finally {
      return s3Response;
    }
  });
  console.log("outside handler let's log getObjectRequests");
  console.log(getObjectRequests);
};
