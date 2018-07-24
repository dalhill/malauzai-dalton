const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const AWS = require("aws-sdk");
const app = express();


const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE;
const dynamoDB = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});

app.use(bodyParser.json({ strict: false }));

app.post("/", (req, res) => {
  if (typeof req.body.customerName !== "string") {
    res.status(400).json({ error: "Please specify a customerName of type string."});
    return;
  }

  const params = {
    TableName: CUSTOMERS_TABLE,
    Key: {
      customerName: req.body.customerName
    }
  };

  dynamoDB.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: "Could not get customer." });
    } else if (result && result.Item) {
      const customer = result.Item;
      res.json({ customer });
    } else {
      res.status(404).json({ error: "Customer not found." })
    }
  })
});

module.exports.handler = serverless(app);