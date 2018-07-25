## Project Dependencies
The project utilizes the Serverless Framework to deploy. 
The project's "serverless.yml" file is currently configured to deploy to AWS. 
This means that you'll need to have an AWS account. 
A much more detailed explanation on how to set up the Serverless Framework with
AWS can be found by reading the [Quick Start](https://serverless.com/framework/docs/providers/aws/guide/quick-start/)
guide on the Serverless website.

Other than setting up Serverless, the only other dependencies can be found
in the "package.json" file.


## What Does the Project Do?
#### High Level
The project is an RESTFUL API that accepts requests from customers. After accepting
a request, the project takes the customer's details and makes a request to 
Google's Place Search API. After the project receives the data from Google,
it returns the data back to the customer.


#### Technical Details
1. Project is a server-side application in NodeJS that exposes a RESTFUL API.
2. Project accepts POST requests which contain a JSON body with the attributes
"customerName", "latitude", and "longitude". customerName must be a string,
while both latitude and longitude must be numbers.
3. Project utilizes Google's [Place Search API](https://developers.google.com/places/web-service/search).
4. Project uses the customerName attribute to fetch details about the customer
from a DynamoDB. It then uses these details along with the latitude and longitude
to return appropriate results to the customer.
5. No customer data is stored in the project itself; the data resides in the
database.
6. Project uses [Jest](https://jestjs.io/) for automated testing. Tests can
be ran by executing either "Jest" or "npm test" at the command line when inside
the root directory of the project.
7. Project has documentation that instructs the user on how to run the
project.
8. Project does not incorporate linting; though this could be added at a later
date.


##### Note: 
The project's RESTFUL API is not exposed on port 3000. This is due to not
being able to specify a port when using AWS API Gateway. In order to specify
a port, the project could be moved to another service such as AWS EC2.