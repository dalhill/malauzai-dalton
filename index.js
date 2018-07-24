const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { getCustomer, createRequest } = require("./customers/utils");

app.use(bodyParser.json({ strict: false }));

app.post("/", (req, res) => {
  if (typeof req.body.customerName !== "string") {
    res.status(400).json({ error: "Please specify a customerName of type string."});
    return;
  } else if (typeof req.body.latitude !== "number") {
    res.status(400).json({ error: "Please specify a latitude of type number."});
    return;
  } else if (typeof req.body.longitude !== "number") {
    res.status(400).json({ error: "Please specify a latitude of type number."});
    return;
  }

  getCustomer(req.body.customerName, (error, customer) => {
    if (error) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.status(200).json({ customer });
    }
  })



  // const params = {
  //   TableName: CUSTOMERS_TABLE,
  //   Key: {
  //     customerName: req.body.customerName
  //   }
  // };
//
  // dynamoDB.get(params, (error, result) => {
  //   if (error) {
  //     console.log(error);
  //     res.status(400).json({ error: "Could not get customer." });
  //   } else if (result && result.Item) {
  //     const customer = result.Item;
  //     res.json({ customer });
  //   } else {
  //     res.status(404).json({ error: "Customer not found." })
  //   }
  // })
});

module.exports.handler = serverless(app);