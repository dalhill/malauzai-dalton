const { readFile } = require("fs");
const { getCustomer, makeAxiosInstance, parseResponse } = require("./utils");


describe("Testing of the getCustomer function", () => {
  test("400 should be thrown when a non-string customerName is supplied to the function.", done => {
    getCustomer(10, ({status}) => {
      expect(status).toBe(400);
      done();
    })
  });
  test("404 should be thrown when a customerName is given, but this customer doesn't exist in the DB.", done => {
    getCustomer("9839AJLKFJASOPIWAFJWIOAJFWD82ALSKDFJASDJFKOWIAJF98", ({status}) => {
      expect(status).toBe(404);
      done();
    })
  })
});


describe("Testing of the makeAxiosInstance function", () => {
  const testCustomer = {
    customerName: "Bob",
    key: "010101010101",
    type: "atm",
    language: "pl",
    output: "xml",
    resultCount: 200
  };
  test("Desired axios instance when NO pagetoken is given.", () => {
    expect(makeAxiosInstance(testCustomer, 20, 30).defaults.params).toEqual(
      {
        key: '010101010101',
        type: 'atm',
        language: 'pl',
        name: "Bob",
        location: '20,30',
        radius: 50000
      });
  });
  test("Desired axios instance when pagetoken is given.", () => {
    const pagetoken = "02309845983475938475983";
    expect(makeAxiosInstance(testCustomer, 20, 30, pagetoken).defaults.params).toEqual(
      {
        pagetoken,
        key: '010101010101'
      });
  })
});


describe("Testing of the parseResponse function", () => {
  test("Extracts all results from JSON response.", done => {
    const fileType = "json";
    readFile(`./test_data/response.${fileType}`, (err, data) => {
      const response = { data: JSON.parse(data.toString()) };
      const { newResults, pagetoken } = parseResponse(response, fileType);
      expect(newResults).toEqual(response.data.results);
      expect(typeof pagetoken).toBe("undefined");
      done();
    })
  });
  test("Extracts all results form XML response.", done => {
    const fileType = "xml";
    readFile(`./test_data/response.${fileType}`, (err, data) => {
      const response = { data: data.toString() };
      const { newResults, pagetoken } = parseResponse(response, fileType);
      expect(newResults.length).toEqual(4);
      expect(typeof pagetoken).toBe("undefined");
      done();
    })
  })
});