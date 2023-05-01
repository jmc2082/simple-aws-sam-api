const AWS = require('aws-sdk');

const JM_SUBSCRIBE_TABLE = process.env.JM_SUBSCRIBE_TABLE;
const dynamodb = new AWS.DynamoDB();
const uuid = require('uuid');

function checkFieldNotEmpty(fieldVal) {
  return (fieldVal !== '') &&
      (fieldVal !== undefined) &&
      (fieldVal !== null);
}

function emailRegex(fieldVal) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(fieldVal);
}

function checkValidEmail(fieldVal) {
  return !!((checkFieldNotEmpty(fieldVal)) && (emailRegex(fieldVal) !== false));
}

exports.subscribe = async (event, context) => {
  const timestamp = String(new Date().getTime());
  const data = JSON.parse(event.body);
  let body;
  let statusCode = 400;
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow any origin to access the resource
    'Access-Control-Allow-Headers': 'Content-Type', // Allow the Content-Type header
    'Access-Control-Allow-Methods': 'OPTIONS,POST' // Allow these HTTP methods
  };

  const params = {
    TableName: JM_SUBSCRIBE_TABLE,
    Item: {
      id: { S: uuid.v1() },
      formEntryType: { S: data.formEntryType },
      emailAddress: { S: data.emailAddress },
      createdAt: { S: timestamp },
    }
  };

  if (!checkValidEmail(data.emailAddress)) {
    const emailSuggestion = 'Email address is not valid. Please enter a valid email address. Ex: "yourname@domain.com"';
    console.log('---------------------');
    console.error(emailSuggestion);
    console.log('---------------------');

    body = JSON.stringify({
      statusCode,
      success: false,
      message: emailSuggestion,
      emailAddress: data.emailAddress,
    });
    
    return {
      statusCode,
      body,
      headers
    };
  } else {
    try {
      const data = await dynamodb.putItem(params).promise().then(response => response);
      statusCode = 200;

      body = JSON.stringify({
        statusCode,
        success: true,
        message: 'Thank you! Your email address has been added to my subscription list.',
        emailAddress: data.emailAddress,
      });
      
      return {
        statusCode,
        body,
        headers
      };
    } catch (err) {
      statusCode = 400;
      console.log('----------- Start Catch Block error --------------');
      console.log(err);
      console.log('----------- End Catch Block error --------------');

      body = JSON.stringify({
        statusCode,
        success: false,
        message: 'An error occurred while trying to submit your email address.',
        emailAddress: data.emailAddress,
        err,
      });

      return {
        statusCode,
        body,
        headers
      };
    }
  }
};
