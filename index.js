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
      return;
    }
    const googleAPIRequest = createRequest(customer, req.body.latitude, req.body.longitude);
    googleAPIRequest.get()
      .then(response => {
        if (customer.output === "xml") {
          res.status(200);
          res.type("text/xml");
          res.send(response.data)
        } else {
          res.status(200).json({ results: response.data.results})
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ error: "Something went wrong between the server and google's API."})
      })
  })
});

module.exports.handler = serverless(app);