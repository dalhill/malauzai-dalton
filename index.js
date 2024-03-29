const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const { getCustomer, makeAxiosInstance, parseResponse } = require("./utils");
const { Builder } = require("xml2js");

app.use(bodyParser.json({ strict: false }));

app.post("/", (req, res) => {
  const errorMessages = [];
  if (typeof req.body.customerName !== "string") errorMessages.push("Please specify a customerName of type string.");
  if (typeof req.body.latitude !== "number") errorMessages.push("Please specify a latitude of type number.");
  if (typeof req.body.longitude !== "number") errorMessages.push("Please specify a longitude of type number.");
  if (errorMessages.length > 0) {
    res.status(400).json({ error: errorMessages});
    return;
  }

  getCustomer(req.body.customerName, (error, customer) => {
    if (error) {
      res.status(error.status).json({ error: [error.message] });
      return;
    }
    let results = [];
    const request = (pagetoken) => {
      makeAxiosInstance(customer, req.body.latitude, req.body.longitude, pagetoken).get()
        .then(response => {
          const { newResults, next_page_token } = parseResponse(response, customer.output);
          if (typeof newResults !== "undefined") {
            results = results.concat(newResults.slice(0, customer.resultCount - results.length));
          }
          if (typeof next_page_token !== "undefined" && results.length < customer.resultCount) {
            setTimeout(() => { request(next_page_token) }, 2500);  // must wait at least 2 seconds for pagetoken activation (read google search docs)
          } else {
            if (customer.output === "xml") {
              res.status(200);
              const builder = new Builder();
              res.send(builder.buildObject({ root: { result: results } }));
            } else {
              res.status(200).json({ results });
            }
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: "Something went wrong when fetching from Google's API."})
        })
    };
    request();
  })
});

module.exports.handler = serverless(app);