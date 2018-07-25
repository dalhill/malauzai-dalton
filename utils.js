const axios = require("axios");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE ? process.env.CUSTOMERS_TABLE : "customers-table-dev";
const { parseString } = require("xml2js");


const getCustomer = (customerName, callback) => {
  const params = { TableName: CUSTOMERS_TABLE, Key: { customerName } };
  dynamoDB.get(params, (error, result) => {
    if (error) {
      console.log(error);
      callback({ status: 400, message: "Could not get customer."}, null);
    } else if (result && result.Item) {
      callback(null, result.Item)
    } else {
      callback({status: 404, message: "Customer not found."}, null);
    }
  })
};


const makeAxiosInstance = (customer, latitude, longitude, pagetoken) => {
  const { key, type, language, customerName, output } = customer;
  const baseURL = `https://maps.googleapis.com/maps/api/place/nearbysearch/${output}`;
  if (pagetoken) return axios.create({
    baseURL,
    params: {
      key,
      pagetoken
    }
  });
  return axios.create({
    baseURL,
    params: {
      key,
      type,
      language,
      name: customerName,
      location: `${latitude},${longitude}`,
      radius: 50000
    }
  })
};

const parseResponse = (response, output) => {
  let newResults, next_page_token;
  if (output === "xml") {
    parseString(response.data, (err, res) => {
      if (res.PlaceSearchResponse.status[0] !== "ZERO_RESULTS") {
        newResults = res.PlaceSearchResponse.result;
      }
      if (typeof res.PlaceSearchResponse.next_page_token !== "undefined") {
        next_page_token = res.PlaceSearchResponse.next_page_token[0];
      }
    });
  } else {
    newResults = response.data.results;
    next_page_token = response.data.next_page_token
  }
  return { newResults, next_page_token }
};


module.exports = {
  getCustomer,
  makeAxiosInstance,
  parseResponse
};