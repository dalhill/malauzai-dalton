const { getCustomer } = require("./utils");


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