const axios = require("axios");
const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const CUSTOMERS_TABLE = process.env.CUSTOMERS_TABLE;


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
  if (pagetoken) return axios.create({
    baseURL: `https://maps.googleapis.com/maps/api/place/nearbysearch/output`,
    params: {
      key,
      pagetoken
    }
  });
  return axios.create({
    baseURL: `https://maps.googleapis.com/maps/api/place/nearbysearch/output`,
    params: {
      key,
      type,
      language,
      name: customerName,
      location: `${30.2672},${97.7431}`,
      radius: 50000
    }
  })
};


module.exports = {
  getCustomer,
  makeAxiosInstance
};