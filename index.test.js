const axios = require("axios");
const apiUrl = "https://xepooj656f.execute-api.us-east-1.amazonaws.com/dev";


describe("Tests the ability for the API to throw correct errors when the request doesn't specify correct values.", () => {
  test("3 errors are thrown when API is hit with no data given.", done => {
    axios({method: "POST", baseURL: apiUrl, data: {}})
      .catch(err => {
        expect(Array.isArray(err.response.data.error)).toBeTruthy();
        expect(err.response.data.error.length).toBe(3);
        done();
      })
  });
  test("3 errors thrown when all data types are incorrect", done => {
    axios({method: "POST", baseURL: apiUrl, data: {customerName: 10, latitude: "Err", longitude: "Err"}})
      .catch(err => {
        expect(Array.isArray(err.response.data.error)).toBeTruthy();
        expect(err.response.data.error.length).toBe(3);
        done();
      })
  })
});

