# SIMPLE AWS SAM / SAM CLI API - EMAIL ADDRESS SUBSCRIPTION API

### DETAILS
* This is an example proof of concept project that I am working on in order to show how it is possible to 
* leverage AWS serverless technologies via the SAM CLI in order to create a serverless api.

### TECH STACK
* AWS SAM / SAM CLI
** SAM utilizes: AWS - cloudformation, api gateway, lambda (javascript, node16x), dynamodb

### PROBLEM TO SOLVE
* I have a simple SAM project with one function named "subscribe".  This function simply collects and stores an email address 
* in dynamodb. I am able to use this api with Postan (api testing tool), but I am having trouble configuring CORS on the project.
* I'll start off by saying that the api works fine when testing from a tool like "Postman" but does not work when testing from a 
* web application from the browser.
* So far I've tried adjusting the "template.yaml" file:

Resources:
  JmSubscribeApi:
    Type: AWS::Serverless::Api
    Properties:
      StageName: Prod
      Cors:
        AllowMethods: "'OPTIONS,POST'"
        AllowHeaders: "'content-type'"
        AllowOrigin: "'*'"
        MaxAge: "'600'"
        AllowCredentials: false
        
  * I've also tried adding some extra configuration to the lambda function itself:
  
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow any origin to access the resource
    'Access-Control-Allow-Headers': 'Content-Type', // Allow the Content-Type header
    'Access-Control-Allow-Methods': 'OPTIONS,POST' // Allow these HTTP methods
  };
  
  * I am new to the "SAM CLI Toolkit" so I am just trying to figure out how to resolve the CORS issue
  * without having to manually go into AWS and add those configs.
  * I would prefer to adjust everything from the code files "template.yaml" and or the "subscribe.js" file 
  * then build and deploy the changes via the SAM CLI.
  * Any suggestions are welcome!
  * Thank you!
